import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import sanitizeHtml from 'sanitize-html';
const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, process.env.OUTPUT_DIR || '_site');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'source-export/manifest.json'), 'utf8'));
async function* walk(dir) {
  for (const ent of await fs.readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(full); else yield full;
  }
}
test('Jeder WordPress-Inhalt hat eine Markdown-Datei und eine HTML-Seite', async () => {
  for (const entry of manifest.entries) {
    const content = matter(await fs.readFile(path.join(root, entry.file), 'utf8'));
    assert.equal(content.data.wordpress_id, entry.id);
    assert.equal(content.data.source, entry.source);
    const html = await fs.readFile(path.join(out, entry.slug, 'index.html'), 'utf8');
    assert.match(html, /<html lang="de">/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.ok(!html.includes('wp-content/'), entry.slug + ' enthält einen WordPress-Medienpfad');
    if (entry.empty) assert.equal(content.content.trim(), '');
  }
});
test('Alle lokalen Links, Bilder und Stylesheets existieren; keine WordPress-Abhängigkeit', async () => {
  for await (const file of walk(out)) {
    if (!file.endsWith('.html')) continue;
    const html = await fs.readFile(file, 'utf8');
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) continue;
      const local = path.resolve(path.dirname(file), decodeURIComponent(href.split(/[?#]/)[0]));
      assert.ok(local.startsWith(out + path.sep), `${file}: unsicherer Pfad ${href}`);
      await assert.doesNotReject(fs.stat(local), `${file}: fehlendes Ziel ${href}`);
    }
    assert.ok(!html.includes('/wp-includes/'));
    assert.ok(!html.includes('fonts.googleapis.com'));
    assert.ok(!html.includes('api.fontshare.com'));
  }
});
test('Alle veröffentlichten Originalmedien sind lokal gesichert', async () => {
  for (const image of manifest.media) {
    const stat = await fs.stat(path.join(root, 'public', image.local));
    assert.ok(stat.size > 0, image.local);
  }
});
test('Swift-Code, Diagramme, Feed und Sitemap wurden übernommen', async () => {
  const memory = await fs.readFile(path.join(out, 'speicherverwaltung/index.html'), 'utf8');
  assert.equal((memory.match(/<img /g) || []).length, 5);
  const generic = await fs.readFile(path.join(out, 'generische-datentypen-was-ist-das/index.html'), 'utf8');
  assert.match(generic, /language-swift/);
  assert.match(generic, /Optional/);
  for (const file of ['feed.xml', 'sitemap.xml', 'robots.txt', '404.html']) await fs.stat(path.join(out, file));
});
test('Alle Codeblöcke entsprechen unverändert den WordPress-Originalen', async () => {
  const posts = JSON.parse(await fs.readFile(path.join(root, 'source-export/posts-full.json'), 'utf8'));
  const codeBlocks = html => [...html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)]
    .map(m => sanitizeHtml(m[1], {allowedTags: [], allowedAttributes: {}}).trim());
  for (const post of posts) {
    const html = await fs.readFile(path.join(out, post.slug, 'index.html'), 'utf8');
    assert.deepEqual(codeBlocks(html), codeBlocks(post.content.rendered), post.slug);
  }
});

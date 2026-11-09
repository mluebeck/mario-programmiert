import fs from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';

const root = path.resolve(import.meta.dirname, '..');
const read = async name => JSON.parse(await fs.readFile(path.join(root, 'source-export', `${name}.json`), 'utf8'));
const [posts, pages, media, categories, tags] = await Promise.all(['posts-full', 'pages', 'media', 'categories', 'tags'].map(read));
const td = new TurndownService({headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-'});
td.addRule('codeBlocks', {
  filter: node => node.nodeName === 'PRE',
  replacement: (_, node) => {
    const code = node.querySelector('code');
    const language = code?.className.match(/language-([\w-]+)/)?.[1] || '';
    const text = (code || node).textContent.replace(/\n$/, '');
    const fence = '`'.repeat(Math.max(3, ...([...text.matchAll(/`+/g)].map(m => m[0].length + 1))));
    return `\n\n${fence}${language}\n${text}\n${fence}\n\n`;
  }
});
// Decode title entities without interpreting titles as Markdown.
const decode = text => td.turndown(text).replace(/\\([\\`*_[\]{}()#+.!>-])/g, '$1');
const mediaById = new Map(media.map(item => [item.id, item]));
const catById = new Map(categories.map(item => [item.id, decode(item.name)]));
const tagById = new Map(tags.map(item => [item.id, decode(item.name)]));
const imagePath = url => `/assets/images/${decodeURIComponent(new URL(url).pathname.split('/').pop())}`;
const originalOrigin = 'https://mario-programmiert.de';
const localize = html => html.replace(/(href|src)="([^"]+)"/g, (all, attr, raw) => {
  const url = new URL(raw.replaceAll('&amp;', '&'), originalOrigin);
  if (url.origin !== originalOrigin) return all;
  if (url.pathname.startsWith('/wp-content/uploads/')) return `${attr}="${imagePath(url.href)}"`;
  if (attr === 'href') {
    if (url.searchParams.has('p')) {
      const post = posts.find(p => p.id === Number(url.searchParams.get('p')));
      if (post) return `href="/${post.slug}/${url.hash}"`;
    }
    return `href="${url.pathname.replace(/\/?$/, '/')}${url.search}${url.hash}"`;
  }
  return all;
});
const manifest = [];
for (const [kind, entries] of [['posts', posts], ['pages', pages]]) {
  await fs.mkdir(path.join(root, 'content', kind), {recursive: true});
  for (const entry of entries) {
    const image = mediaById.get(entry.featured_media);
    const html = entry.content.rendered;
    const meta = {
      title: decode(entry.title.rendered),
      date: entry.date,
      modified: entry.modified || entry.date,
      slug: entry.slug,
      author: 'Mario Rotz',
      categories: (entry.categories || []).map(id => catById.get(id)).filter(Boolean),
      tags: (entry.tags || []).map(id => tagById.get(id)).filter(Boolean),
      image: image ? imagePath(image.source_url) : '',
      source: entry.link,
      wordpress_id: entry.id,
      empty: !html.trim()
    };
    const frontmatter = Object.entries(meta).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
    const body = td.turndown(localize(html));
    const file = `content/${kind}/${entry.slug}.md`;
    // The importer never overwrites editorial work without explicit consent.
    try { await fs.writeFile(path.join(root, file), `---\n${frontmatter}\n---\n\n${body}\n`, {flag: 'wx'}); }
    catch (error) { if (error.code !== 'EEXIST') throw error; console.log(`Bereits vorhanden, unverändert: ${file}`); }
    manifest.push({id: entry.id, kind, file, source: entry.link, slug: entry.slug, empty: meta.empty});
  }
}
await fs.writeFile(path.join(root, 'source-export', 'manifest.json'), JSON.stringify({
  exportedAt: new Date().toISOString(),
  origin: originalOrigin,
  entries: manifest,
  media: media.map(m => ({id: m.id, url: m.source_url, local: imagePath(m.source_url)}))
}, null, 2) + '\n');
console.log(`Importiert: ${posts.length} Beiträge, ${pages.length} Seiten. ${manifest.filter(x => x.empty).length} leere Inhalte unverändert belassen.`);

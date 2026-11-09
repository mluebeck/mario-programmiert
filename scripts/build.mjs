import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js/lib/core';
import swift from 'highlight.js/lib/languages/swift';

hljs.registerLanguage('swift', swift);
const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, process.env.OUTPUT_DIR || '_site');
if (!out.startsWith(root + path.sep) || out === root) throw new Error('Ungültiges Ausgabeverzeichnis');
const site = JSON.parse(await fs.readFile(path.join(root, 'site.json'), 'utf8'));
const sourceMedia = JSON.parse(await fs.readFile(path.join(root, 'source-export/media.json'), 'utf8'));
const imageInfo = new Map(sourceMedia.map(m => [decodeURIComponent(new URL(m.source_url).pathname.split('/').pop()), m.media_details]));
const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const canonicalRoot = (process.env.SITE_URL || site.url || site.originalUrl).replace(/\/$/, '');
const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const text = html => sanitizeHtml(html, {allowedTags: [], allowedAttributes: {}}).replace(/\s+/g, ' ').trim();
const date = value => new Intl.DateTimeFormat('de-DE', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date(value + 'Z'));
const md = new MarkdownIt({
  html: true,
  highlight: (code, lang) => lang && hljs.getLanguage(lang) ? hljs.highlight(code, {language: lang}).value : esc(code)
});
async function readEntries(kind) {
  const files = (await fs.readdir(path.join(root, 'content', kind))).filter(f => f.endsWith('.md'));
  return Promise.all(files.map(async file => {
    const parsed = matter(await fs.readFile(path.join(root, 'content', kind, file), 'utf8'));
    return {...parsed.data, kind, body: parsed.content, html: md.render(parsed.content)};
  }));
}
const [posts, pages] = await Promise.all([readEntries('posts'), readEntries('pages')]);
posts.sort((a, b) => b.date.localeCompare(a.date));
const allRoutes = new Set(['', '404', ...posts.map(p => p.slug), ...pages.map(p => p.slug), 'author/adminmario']);
const categorySlugs = new Map([['Gesellschaft', 'gesellschaft'], ['Grundlagen', 'grundlagen'], ['Uncategorized', 'uncategorized']]);
for (const p of posts) for (const cat of p.categories || []) {
  if (!categorySlugs.has(cat)) categorySlugs.set(cat, cat.toLowerCase().replace(/\s+/g, '-'));
}
for (const slug of categorySlugs.values()) allRoutes.add(`category/${slug}`);
const tagSlug = label => label.toLowerCase().replace(/\s+/g, '-');
for (const p of posts) for (const tag of p.tags || []) allRoutes.add(`tag/${tagSlug(tag)}`);
function localLink(target, route) {
  const url = new URL(target, site.originalUrl);
  if (url.origin !== site.originalUrl) return null;
  let pathname = decodeURIComponent(url.pathname);
  // Strip a project prefix before resolving on GitHub Pages.
  if (base && pathname.startsWith(base + '/')) pathname = pathname.slice(base.length);
  const relative = path.posix.relative(route || '.', pathname.replace(/^\//, '') || '.');
  let dest = relative || '.';
  if (!path.posix.extname(pathname)) dest = `${dest.replace(/\/$/, '')}/index.html`;
  return dest + url.search + url.hash;
}
function link(route, target = '') {
  return localLink('/' + target, route);
}
function cleanAndLink(html, route) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {...sanitizeHtml.defaults.allowedAttributes, '*': ['class', 'id'], a: ['href', 'title', 'target', 'rel'], img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding']},
    transformTags: {
      a: (_, attrs) => {
        const local = attrs.href && localLink(attrs.href, route);
        return {tagName: 'a', attribs: {...attrs, ...(local !== null && local !== false ? {href: local} : {target: '_blank', rel: 'noopener noreferrer'})}};
      },
      img: (_, attrs) => {
        const info = imageInfo.get(attrs.src.split('/').pop());
        return {tagName: 'img', attribs: {...attrs, ...(info ? {width: String(info.width), height: String(info.height)} : {}), src: localLink(attrs.src, route) || attrs.src, loading: 'lazy', decoding: 'async', alt: attrs.alt === 'alt text' ? (attrs.title || '') : (attrs.alt || '')}};
      },
      h4: (_, attrs) => ({tagName: 'h2', attribs: attrs})
    }
  });
}
function metadata(p, route) {
  return `<div class="meta">${p.categories?.map(cat => `<a href="${link(route, `category/${categorySlugs.get(cat)}/`)}">${esc(cat)}</a>`).join(' / ') || ''}<span aria-hidden="true"> / </span><time datetime="${esc(p.date)}">${date(p.date)}</time></div>`;
}
function card(p, route, featured = false) {
  const image = p.image ? `<a class="post-image" tabindex="-1" aria-hidden="true" href="${link(route, p.slug + '/')}"><img src="${link(route, p.image.slice(1))}" alt="" decoding="async" loading="lazy"></a>` : '';
  const excerpt = text(p.html.match(/<p>[\s\S]*?<\/p>/)?.[0] || '').slice(0, 220);
  return `<article class="post ${featured ? 'post-featured' : ''} ${image ? 'post-illustrated' : ''}">${image}<div class="post-copy">${metadata(p, route)}<h2><a href="${link(route, p.slug + '/')}">${esc(p.title)}</a></h2><p class="byline">von ${esc(p.author)}</p>${excerpt ? `<p class="excerpt">${esc(excerpt)}${text(p.html).length > 220 ? '…' : ''}</p>` : ''}<a class="read-more" href="${link(route, p.slug + '/')}">Artikel lesen <span aria-hidden="true">→</span><span class="sr-only">: ${esc(p.title)}</span></a></div></article>`;
}
function template({route = '', title = site.title, description = site.description, body, entry, noindex = false}) {
  const canonical = canonicalRoot + '/' + (route ? route + '/' : '');
  const schema = entry?.kind === 'posts' ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: entry.title,
    datePublished: entry.date + '+02:00', dateModified: entry.modified + '+02:00',
    author: {'@type': 'Person', name: entry.author}, url: canonical,
    ...(entry.image ? {image: canonicalRoot + entry.image} : {})
  }).replace(/</g, '\\u003c')}</script>` : '';
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title === site.title ? title : title + ' | ' + site.title)}</title>
<meta name="description" content="${esc(description.slice(0, 160))}">
${noindex ? '<meta name="robots" content="noindex">' : ''}<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="${entry?.kind === 'posts' ? 'article' : 'website'}"><meta property="og:locale" content="de_DE"><meta property="og:site_name" content="${esc(site.title)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description.slice(0, 160))}"><meta property="og:url" content="${esc(canonical)}">
${entry?.image ? `<meta property="og:image" content="${esc(canonicalRoot + entry.image)}">` : ''}
<link rel="stylesheet" href="${link(route, 'assets/base.css')}"><link rel="stylesheet" href="${link(route, 'assets/style.css')}">
<link rel="alternate" type="application/rss+xml" title="${esc(site.title)}" href="${link(route, 'feed.xml')}">${schema}</head>
<body><a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
<header class="site-header"><div class="header-inner"><div class="brand"><a class="site-title" href="${link(route)}">${esc(site.title)}</a><p>${esc(site.description)}</p></div>
<nav aria-label="Hauptnavigation"><a href="${link(route)}"${route === '' ? ' aria-current="page"' : ''}>Artikel</a><a href="${link(route, 'sample-page/')}"${route === 'sample-page' ? ' aria-current="page"' : ''}>Über mich</a></nav></div></header>
<main id="inhalt" tabindex="-1" class="${entry ? 'article-main' : 'index-main'}">${body}</main>
<footer class="site-footer"><span>© ${new Date().getUTCFullYear()} ${esc(site.author)}</span><a href="${link(route, 'feed.xml')}">RSS-Feed</a><a href="${esc(site.repository)}" target="_blank" rel="noopener noreferrer">GitHub</a></footer></body></html>`;
}
await fs.rm(out, {recursive: true, force: true});
await fs.mkdir(out, {recursive: true});
await fs.cp(path.join(root, 'public'), out, {recursive: true});
// Self-host original typefaces: no third-party font requests by visitors.
await fs.mkdir(path.join(out, 'assets', 'fonts'), {recursive: true});
for (const [font, weights] of [['libre-franklin', [700]], ['roboto', [400, 700]]]) {
  for (const weight of weights) {
    const filename = `${font}-latin-${weight}-normal.woff2`;
    await fs.copyFile(path.join(root, 'node_modules', '@fontsource', font, 'files', filename), path.join(out, 'assets', 'fonts', filename));
  }
}
async function writePage(route, options) {
  const file = route === '404' ? path.join(out, '404.html') : path.join(out, route, 'index.html');
  await fs.mkdir(path.dirname(file), {recursive: true});
  await fs.writeFile(file, template({route: route === '404' ? '' : route, ...options}));
}
await writePage('', {body: `<section class="posts" aria-label="Artikel">${posts.map((p, i) => card(p, '', i === 0)).join('')}</section>`});
for (const entry of [...posts, ...pages]) {
  const route = entry.slug;
  const html = cleanAndLink(entry.html, route);
  const heroImage = entry.image ? cleanAndLink(`<img src="${esc(entry.image)}" alt="${esc(entry.title)}" class="article-image">`, route) : '';
  const note = !entry.body.trim() ? '<p class="empty-note">Zu diesem Beitrag ist noch kein Text veröffentlicht.</p>' : '';
  const other = entry.kind === 'posts' ? `<aside class="more-articles" aria-label="Weitere Artikel"><h2>Weitere Artikel</h2>${posts.filter(p => p.slug !== route).slice(0, 2).map(p => `<a href="${link(route, p.slug + '/')}">${esc(p.title)} <span aria-hidden="true">→</span></a>`).join('')}</aside>` : '';
  await writePage(route, {title: entry.title, description: text(entry.html) || entry.title, entry,
    body: `<article><a class="back-link" href="${link(route)}">← Alle Artikel</a><header class="article-header">${entry.kind === 'posts' ? metadata(entry, route) : ''}<h1>${esc(entry.title)}</h1>${entry.kind === 'posts' ? `<p class="byline">von ${esc(entry.author)}</p>` : ''}</header>${heroImage}<div class="prose">${html}${note}</div></article>${other}`});
}
for (const [label, slug] of categorySlugs) {
  const route = `category/${slug}`;
  await writePage(route, {title: label, body: `<h1 class="archive-title">${esc(label)}</h1><section class="posts" aria-label="Artikel">${posts.filter(p => p.categories.includes(label)).map(p => card(p, route)).join('')}</section>`});
}
for (const tag of new Set(posts.flatMap(p => p.tags || []))) {
  const route = `tag/${tagSlug(tag)}`;
  await writePage(route, {title: tag, body: `<h1 class="archive-title">${esc(tag)}</h1><section class="posts" aria-label="Artikel">${posts.filter(p => p.tags.includes(tag)).map(p => card(p, route)).join('')}</section>`});
}
await writePage('author/adminmario', {title: site.author, body: `<h1 class="archive-title">${esc(site.author)}</h1><section class="posts" aria-label="Artikel">${posts.map(p => card(p, 'author/adminmario')).join('')}</section>`});
await writePage('404', {title: 'Seite nicht gefunden', noindex: true, body: '<section class="not-found"><h1>Hier ist leider nichts.</h1><p>Diese Seite wurde nicht gefunden. Auf der Startseite findest du alle Artikel.</p><a href="./index.html">Zur Startseite →</a></section>'});
const urls = [...allRoutes].filter(r => r !== '404');
await fs.writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(r => `<url><loc>${esc(canonicalRoot + '/' + (r ? r + '/' : ''))}</loc></url>`).join('')}</urlset>`);
await fs.writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${canonicalRoot}/sitemap.xml\n`);
await fs.writeFile(path.join(out, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(site.title)}</title><link>${esc(canonicalRoot)}/</link><description>${esc(site.description)}</description><language>de</language>${posts.map(p => `<item><title>${esc(p.title)}</title><link>${esc(canonicalRoot + '/' + p.slug + '/')}</link><guid isPermaLink="false">${esc(p.source || canonicalRoot + '/' + p.slug + '/')}</guid><pubDate>${new Date(p.date + 'Z').toUTCString()}</pubDate><description>${esc(text(p.html).slice(0, 300))}</description></item>`).join('')}</channel></rss>`);
await fs.writeFile(path.join(out, '.nojekyll'), '');
console.log(`Gebaut: ${urls.length + 1} Seiten in ${path.relative(root, out)}. Basis: ${base || '/'}. Kanonische URL: ${canonicalRoot}`);

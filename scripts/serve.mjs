import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..', process.env.OUTPUT_DIR || '_site');
const types = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.xml': 'application/xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain'};
http.createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + requested);
    if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Ungültiger Pfad');
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const bytes = await fs.readFile(file);
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(bytes);
  } catch {
    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(await fs.readFile(path.join(root, '404.html'), 'utf8').catch(() => 'Nicht gefunden'));
  }
}).listen(Number(process.env.PORT || 4173), '0.0.0.0', () => console.log('Vorschau auf http://127.0.0.1:' + (process.env.PORT || 4173)));

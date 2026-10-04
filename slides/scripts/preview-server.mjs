import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
export function createPreviewServer(directory) {
  const root = resolve(directory);
  return createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      let path = resolve(root, '.' + pathname);
      if (path !== root && !path.startsWith(root + sep)) throw new Error('Invalid path');
      if ((await stat(path)).isDirectory()) {
        if (!pathname.endsWith('/')) { response.writeHead(301, { Location: pathname + '/' }); response.end(); return; }
        path = resolve(path, 'index.html');
      }
      const body = await readFile(path);
      response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
}

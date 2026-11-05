import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
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
      const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Content-Length': body.length };
      const range = request.headers.range;
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        const start = match && match[1] ? Number(match[1]) : match && match[2] ? Math.max(0,body.length-Number(match[2])) : NaN;
        const end = match && match[1] && match[2] ? Math.min(Number(match[2]),body.length-1) : body.length-1;
        if (!match || !Number.isSafeInteger(start) || start<0 || start>=body.length || end<start) { response.writeHead(416, {'Content-Range': `bytes */${body.length}`});response.end();return; }
        response.writeHead(206, {...headers, 'Content-Length': end-start+1, 'Content-Range': `bytes ${start}-${end}/${body.length}`});
        response.end(request.method==='HEAD'?undefined:body.subarray(start,end+1));return;
      }
      response.writeHead(200, headers);
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createPreviewServer } from './preview-server.mjs';
test('serves subpaths, assets and redirects; rejects missing/traversal paths', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'slidev-preview-'));
  const dist = join(directory, 'dist');
  await mkdir(join(dist, 'slides', 'demo'), { recursive: true });
  await writeFile(join(directory, 'outside.txt'), 'not public');
  await writeFile(join(dist, 'slides', 'demo', 'index.html'), '<h1>Demo</h1>');
  await writeFile(join(dist, 'slides', 'demo', 'app.js'), 'console.log("demo")');
  const server = createPreviewServer(dist + '/').listen(0, '127.0.0.1');
  try {
    await once(server, 'listening');
    const origin = `http://127.0.0.1:${server.address().port}`;
    const page = await fetch(origin + '/slides/demo/');
    assert.equal(page.status, 200);
    assert.equal(await page.text(), '<h1>Demo</h1>');
    const redirect = await fetch(origin + '/slides/demo', { redirect: 'manual' });
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get('location'), '/slides/demo/');
    assert.equal((await fetch(origin + '/slides/demo/app.js')).headers.get('content-type'), 'text/javascript');
    assert.equal((await fetch(origin + '/%2e%2e%2foutside.txt')).status, 404);
    assert.equal((await fetch(origin + '/missing')).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); await rm(directory, { recursive: true }); }
});

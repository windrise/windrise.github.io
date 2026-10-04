import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
test('creates a draft deck and refuses duplicate overwrite', async () => {
  const root = await mkdtemp(join(tmpdir(), 'slidev-new-'));
  try {
    const source = fileURLToPath(new URL('../', import.meta.url));
    for (const part of ['scripts', 'templates', 'decks']) await cp(join(source, part), join(root, part), { recursive: true, filter: path => !path.split('/').includes('node_modules') });
    await writeFile(join(root, 'decks.json'), '[]');
    const create = () => spawnSync(process.execPath, [join(root, 'scripts/new.mjs'), 'my-talk', 'My talk'], { encoding: 'utf8' });
    assert.equal(create().status, 0);
    const decks = JSON.parse(await readFile(join(root, 'decks.json'), 'utf8'));
    assert.equal(decks[0].publish, false);
    assert.equal(decks[0].slug, 'my-talk');
    const before = await readFile(join(root, 'decks/my-talk/slides.md'), 'utf8');
    assert.ok(before.includes('title: "My talk"'));
    assert.notEqual(create().status, 0);
    assert.equal(await readFile(join(root, 'decks/my-talk/slides.md'), 'utf8'), before);
  } finally { await rm(root, { recursive: true }); }
});

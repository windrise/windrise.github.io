import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { readDecks } from './catalog.mjs';
const root = new URL('../', import.meta.url);
const decks = (await readDecks(root)).filter(deck => deck.publish);
assert.ok((await stat(new URL('dist/slides/index.html', root))).size > 0);
for (const deck of decks) {
  const html = await readFile(new URL(`dist/slides/${deck.slug}/index.html`, root), 'utf8');
  assert.ok(html.includes(`/slides/${deck.slug}/assets/`), `${deck.slug}: missing correct asset base`);
}
console.log(`Verified directory and ${decks.length} published deck entry points`);

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateSource } from './source.mjs';
import { readDecks, renderIndex } from './catalog.mjs';

const root = new URL('../', import.meta.url);
const decks = await readDecks(root);
const published = decks.filter(deck => deck.publish);
// Validate inputs before touching build output. Only the isolated dist/ is cleared.
for (const deck of published) {
  const source = await readFile(new URL(`decks/${deck.slug}/slides.md`, root), 'utf8');
  validateSource(source, deck.slug);
}
const dist = new URL('dist/', root);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('slides/', dist), { recursive: true });
const cli = fileURLToPath(new URL('node_modules/@slidev/cli/bin/slidev.mjs', root));
for (const deck of published) {
  const result = spawnSync(process.execPath, [cli, 'build', `decks/${deck.slug}/slides.md`, '--base', `/slides/${deck.slug}/`, '--out', fileURLToPath(new URL(`slides/${deck.slug}/`, dist)), '--without-notes'], { cwd: fileURLToPath(root), stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
await writeFile(new URL('slides/index.html', dist), renderIndex(decks));
console.log(`Built ${published.length} public deck(s) in slides/dist/slides/`);

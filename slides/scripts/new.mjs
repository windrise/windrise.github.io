import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { readDecks, validateDecks } from './catalog.mjs';
const root = new URL('../', import.meta.url);
const [slug, title = slug] = process.argv.slice(2);
const decks = await readDecks(root);
const deck = { slug, title, description: '在这里写一句演示简介。', publish: false };
validateDecks([...decks, deck]);
const dir = new URL(`decks/${slug}/`, root);
await mkdir(dir); // Never overwrite an existing deck.
const template = await readFile(new URL('templates/slides.md', root), 'utf8');
await writeFile(new URL('slides.md', dir), template.replaceAll('{{TITLE_JSON}}', JSON.stringify(title)).replaceAll('{{TITLE}}', title.replace(/[\r\n]/g, ' ')));
await writeFile(new URL('decks.json', root), JSON.stringify([...decks, deck], null, 2) + '\n');
console.log(`Created decks/${slug}/slides.md (publish: false). Preview: npx slidev decks/${slug}/slides.md`);

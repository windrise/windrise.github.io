import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, renderIndex, validateDecks } from './catalog.mjs';
const demo = { slug: 'demo', title: 'Demo', description: 'Public demo', publish: true };
test('accepts a reusable multi-deck catalog', () => assert.equal(validateDecks([demo, { ...demo, slug: 'second-talk', publish: false }]).length, 2));
test('rejects unsafe, duplicate and missing publication settings', () => {
  for (const slug of ['../outside', '/root', 'A', 'demo/foo', '', 'x<script>', undefined, null, 1]) assert.throws(() => validateDecks([{ ...demo, slug }]));
  assert.throws(() => validateDecks([demo, demo]));
  assert.throws(() => validateDecks([{ slug: 'draft', title: 'draft', description: '' }]));
  assert.throws(() => validateDecks({}));
});
test('escapes metadata and only links explicitly published decks', () => {
  const html = renderIndex([{ ...demo, title: '<script>alert(1)</script>' }, { ...demo, slug: 'private-draft', publish: false }]);
  assert.ok(html.includes('href="./demo/"'));
  assert.ok(!html.includes('private-draft'));
  assert.ok(!html.includes('<script>'));
  assert.equal(escapeHtml('"&<>\''), '&quot;&amp;&lt;&gt;&#39;');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSource } from './source.mjs';
test('validates the actual top-level frontmatter router mode', () => {
  assert.doesNotThrow(() => validateSource('---\nrouterMode: hash # static hosting\n---\n# Demo', 'demo'));
  assert.throws(() => validateSource('---\nrouterMode: history\n---\n```yaml\nrouterMode: hash\n```', 'demo'));
  assert.throws(() => validateSource('---\nother:\n  routerMode: hash\n---\n# Demo', 'demo'));
  assert.throws(() => validateSource('# No headmatter\nrouterMode: hash', 'demo'));
});

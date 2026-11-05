import test from 'node:test'
import assert from 'node:assert/strict'
import { keyframes, recipeKeyframes } from './datamagic-test-utils.mjs'
test('native frame samples include start, midpoint, and final valid frame', () => {
  assert.deepEqual(keyframes(180), [0, 90, 179])
  assert.deepEqual(keyframes(1), [0])
  assert.deepEqual(keyframes(359), [0, 179, 358])
})

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { PNG } from 'pngjs'
import { comparePng } from './datamagic-test-utils.mjs'
test('pixel comparisons report measured differences and reject dimensions', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'datamagic-diff-'))
  try {
    const a = new PNG({ width: 3, height: 3 }); a.data.fill(255)
    const b = new PNG({ width: 3, height: 3 }); b.data.fill(0)
    for (let i = 3; i < b.data.length; i += 4) b.data[i] = 255
    await fs.writeFile(path.join(dir, 'a.png'), PNG.sync.write(a))
    await fs.writeFile(path.join(dir, 'b.png'), PNG.sync.write(b))
    const same = await comparePng(path.join(dir, 'a.png'), path.join(dir, 'a.png'), path.join(dir, 'diff.png'))
    assert.equal(same.mismatchRatio, 0)
    const different = await comparePng(path.join(dir, 'a.png'), path.join(dir, 'b.png'), path.join(dir, 'diff.png'))
    assert.equal(different.mismatchRatio, 1)
    await fs.writeFile(path.join(dir, 'small.png'), PNG.sync.write(new PNG({ width: 1, height: 1 })))
    await assert.rejects(comparePng(path.join(dir, 'a.png'), path.join(dir, 'small.png'), path.join(dir, 'diff.png')), /dimensions differ/)
  } finally { await fs.rm(dir, { recursive: true, force: true }) }
})

test('narrative samples cover early springs and scene boundaries', () => {
  const frames = recipeKeyframes({id: 'StorySequenceGenerator', frames: 360, native: true});
  for (const frame of [0,8,18,89,90,179,180,269,270,359]) assert.ok(frames.includes(frame));
  assert.equal(frames.length, new Set(frames).size);
  assert.deepEqual([...frames].sort((a,b)=>a-b), frames);
});

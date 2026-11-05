import fs from 'node:fs/promises'
import path from 'node:path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
export function keyframes(frames) {
  const count = Math.max(1, Math.floor(Number(frames) || 1))
  return [...new Set([0, Math.floor(count / 2), count - 1])]
}
export async function comparePng(actualPath, expectedPath, diffPath) {
  const actual = PNG.sync.read(await fs.readFile(actualPath))
  const expected = PNG.sync.read(await fs.readFile(expectedPath))
  if (actual.width !== expected.width || actual.height !== expected.height) throw Error(`Screenshot dimensions differ: ${actual.width}x${actual.height} vs ${expected.width}x${expected.height}`)
  const { width, height } = actual
  const diff = new PNG({ width, height })
  const mismatchedPixels = pixelmatch(actual.data, expected.data, diff.data, width, height, { threshold: 0.1, includeAA: false })
  await fs.writeFile(diffPath, PNG.sync.write(diff))
  return { width, height, mismatchedPixels, mismatchRatio: mismatchedPixels / (width * height), threshold: 0.1, includeAA: false, diff: path.basename(diffPath) }
}

export function recipeKeyframes(recipe) {
  const frames = new Set(keyframes(recipe.frames));
  const add = f => { if (f >= 0 && f < recipe.frames) frames.add(Math.floor(f)) };
  if (recipe.native) [8, 18].forEach(add);
  if (recipe.id === 'RankedReveal') for (const row of recipe.props.rows) [row.at, row.at + .4, row.at + .8].forEach(s => add(s * recipe.fps));
  if (recipe.id === 'StorySequenceGenerator') [45, 76, 89, 90, 102, 135, 166, 179, 180, 192, 225, 256, 269, 270, 282, 310].forEach(add);
  if (recipe.id === 'SharedDataElementTransition') [36, 75, 120, 170, 210, 255].forEach(add);
  return [...frames].sort((a,b) => a-b);
}

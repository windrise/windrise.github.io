/** Full native-card browser audit. Run against an already-built HTTP server in CI.
 * DATAMAGIC_URL=http://127.0.0.1:4173/slides/design-recipes/
 * DATAMAGIC_REFERENCE_URL=http://127.0.0.1:4174/ (optional original React app)
 * Reference: ?id=CatalogId&frame=N, element [data-datamagic-reference-stage].
 * DATAMAGIC_ARTIFACTS=reports/datamagic; DATAMAGIC_IDS=comma,separated (debug only)
 * Fidelity is UNVERIFIED without a reference, never inferred from a smoke pass.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { keyframes, comparePng } from './datamagic-test-utils.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const catalog = JSON.parse(await fs.readFile(new URL('../recipes/catalog.json', import.meta.url), 'utf8'))
const base = process.env.DATAMAGIC_URL || 'http://127.0.0.1:4173/slides/design-recipes/'
const referenceBase = process.env.DATAMAGIC_REFERENCE_URL
const artifacts = path.resolve(root, process.env.DATAMAGIC_ARTIFACTS || 'reports/datamagic')
const subset = process.env.DATAMAGIC_IDS?.split(',').filter(Boolean)
const recipes = subset ? catalog.filter(c => subset.includes(c.id)) : catalog
const report = { startedAt: new Date().toISOString(), base, referenceBase: referenceBase || null, totalCatalog: catalog.length, tested: recipes.length, completeCatalog: recipes.length === catalog.length, fidelity: referenceBase ? 'pending' : 'unverified: original-source comparison not configured', recipes: [], controls: [], pageErrors: [], failedResponses: [], failedRequests: [], failures: [] }
await fs.mkdir(artifacts, { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
const page = await context.newPage()
const reference = referenceBase ? await context.newPage() : null
function track(p, origin) {
  p.on('pageerror', e => report.pageErrors.push({ origin, url: p.url(), message: e.message }))
  p.on('response', response => { if (response.status() >= 400) report.failedResponses.push({ origin, url: response.url(), status: response.status() }) })
  p.on('requestfailed', request => { if (!request.failure()?.errorText?.includes('ERR_ABORTED')) report.failedRequests.push({ origin, url: request.url(), error: request.failure()?.errorText }) })
}
track(page, 'vue'); if (reference) track(reference, 'original')
const hash = value => crypto.createHash('sha256').update(value).digest('hex')
const visiblePlayer = () => page.locator('.dm-player').filter({ has: page.locator('.dm-heading') }).filter({ visible: true }).first()
async function settle(p, stage) {
  await stage.waitFor({ state: 'visible', timeout: 60000 })
  await p.evaluate(() => document.fonts.ready)
  const media = await stage.evaluate(async element => {
    const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))
    const images = [...element.querySelectorAll('img')]
    await Promise.all(images.map(image => Promise.race([image.decode?.().catch(() => {}), timeout(15000)])))
    const videos = [...element.querySelectorAll('video')]
    await Promise.all(videos.map(async video => {
      if (video.seeking || video.readyState < 2) await Promise.race([new Promise(resolve => { video.addEventListener('seeked', resolve, { once: true }); video.addEventListener('loadeddata', resolve, { once: true }); video.addEventListener('error', resolve, { once: true }) }), timeout(15000)])
    }))
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    return { images: images.map(i => ({ src: i.currentSrc || i.src, loaded: i.complete && i.naturalWidth > 0 })), videos: videos.map(v => ({ src: v.currentSrc || v.src, time: v.currentTime, seeking: v.seeking, readyState: v.readyState, error: v.error?.message || null })) }
  })
  return media
}
async function screenshotNative(p, stage, recipe, destination) {
  const oldViewport = p.viewportSize()
  await p.setViewportSize({ width: Math.max(980, recipe.width), height: Math.max(600, recipe.height) })
  await stage.evaluate((element, dims) => {
    const saved = []
    const remember = node => { if (node?.nodeType === 1 && !saved.some(x => x.node === node)) saved.push({ node, css: node.style.cssText }) }
    let current = element
    while (current) { remember(current); current = current.parentElement || current.getRootNode()?.host }
    for (const { node } of saved) Object.assign(node.style, { transform: 'none', overflow: 'visible', contain: 'none', maxWidth: 'none', maxHeight: 'none' })
    Object.assign(element.style, { position: 'fixed', left: '0', top: '0', margin: '0', width: `${dims.width}px`, height: `${dims.height}px`, zIndex: '2147483647' })
    window.__dmScreenshotRestore = () => saved.forEach(({ node, css }) => { node.style.cssText = css })
  }, recipe)
  try { await stage.screenshot({ path: destination, timeout: 30000 }) }
  finally { await p.evaluate(() => { window.__dmScreenshotRestore?.(); delete window.__dmScreenshotRestore }); await p.setViewportSize(oldViewport) }
}
async function assertControl(name, operation) {
  try { await operation(); report.controls.push({ name, passed: true }) }
  catch (error) { report.controls.push({ name, passed: false, error: error.message }); report.failures.push(`${name}: ${error.message}`) }
}
function assert(condition, message) { if (!condition) throw Error(message) }
try {
  for (const recipe of recipes) {
    const index = catalog.findIndex(c => c.id === recipe.id)
    const row = { id: recipe.id, page: index + 2, width: recipe.width, height: recipe.height, frames: [], errors: [] }
    report.recipes.push(row)
    try {
      await page.goto(`${base.replace(/#.*$/, '')}#/${index + 2}`, { waitUntil: 'domcontentloaded' })
      const player = visiblePlayer()
      await player.locator('[aria-label="Choose recipe"]').waitFor({ timeout: 60000 })
      const stage = player.locator('.dm-scene')
      for (const frame of keyframes(recipe.frames)) {
        const slider = player.locator('[aria-label="Animation frame"]')
        await slider.evaluate((element, value) => { element.value = String(value); element.dispatchEvent(new Event('input', { bubbles: true })) }, frame)
        await page.waitForFunction(({ selector, frame }) => [...document.querySelectorAll(selector)].some(el => el.textContent.trim().startsWith(`${frame} /`)), { selector: '.dm-controls output', frame })
        const media = await settle(page, stage)
        const state = await stage.evaluate(element => ({ html: element.innerHTML, count: element.querySelectorAll('*').length, rect: { width: element.clientWidth, height: element.clientHeight } }))
        assert(state.count > 0, `${recipe.id} frame ${frame}: scene has no rendered descendants`)
        assert(state.rect.width === recipe.width && state.rect.height === recipe.height, `${recipe.id}: native stage size changed`)
        assert(!media.images.some(i => !i.loaded), `${recipe.id} frame ${frame}: image failed to decode`)
        assert(!media.videos.some(v => v.error || v.seeking || v.readyState < 2), `${recipe.id} frame ${frame}: video not ready or seek unfinished`)
        const filename = `${recipe.id}-${String(frame).padStart(4, '0')}`
        const vuePng = path.join(artifacts, `${filename}-vue.png`)
        await screenshotNative(page, stage, recipe, vuePng)
        const frameResult = { frame, domHash: hash(state.html + JSON.stringify(media.videos)), elementCount: state.count, media, screenshot: path.basename(vuePng) }
        row.frames.push(frameResult)
        if (reference) {
          const url = new URL(referenceBase); url.searchParams.set('id', recipe.id); url.searchParams.set('frame', String(frame))
          await reference.goto(url.href, { waitUntil: 'domcontentloaded' })
          const originalStage = reference.locator('[data-datamagic-reference-stage]')
          frameResult.referenceMedia = await settle(reference, originalStage)
          const originalPng = path.join(artifacts, `${filename}-original.png`)
          await screenshotNative(reference, originalStage, recipe, originalPng)
          frameResult.referenceScreenshot = path.basename(originalPng)
          frameResult.comparison = await comparePng(vuePng, originalPng, path.join(artifacts, `${filename}-diff.png`))
        }
      }
      row.changesAcrossFrames = new Set(row.frames.map(f => f.domHash)).size > 1
      assert(row.changesAcrossFrames, `${recipe.id}: scene DOM/media does not change across sampled frames`)
    } catch (error) { row.errors.push(error.message); report.failures.push(`${recipe.id}: ${error.message}`) }
    await fs.writeFile(path.join(artifacts, 'report.json'), JSON.stringify(report, null, 2))
    console.log(`${row.errors.length ? 'FAIL' : 'OK'} ${recipe.id} (${row.frames.length} keyframes)`)
  }
  const target = catalog.find(c => c.id === 'RankedReveal') || catalog[0]
  const targetIndex = catalog.findIndex(c => c.id === target.id)
  await page.goto(`${base.replace(/#.*$/, '')}#/${targetIndex + 2}`, { waitUntil: 'domcontentloaded' })
  await settle(page, visiblePlayer().locator('.dm-scene'))
  await assertControl('deep-link reload restores selected recipe', async () => {
    await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page, visiblePlayer().locator('.dm-scene'))
    assert(await visiblePlayer().locator('[aria-label="Choose recipe"]').inputValue() === target.id, 'Wrong recipe after reload')
  })
  await assertControl('reduced-motion does not autoplay', async () => {
    const slider = visiblePlayer().locator('[aria-label="Animation frame"]'); const initial = await slider.inputValue()
    await page.waitForTimeout(650); assert(await slider.inputValue() === initial, 'Frame advanced without an explicit play action')
    assert(await visiblePlayer().getByRole('button', { name: 'Play animation', exact: true }).count() === 1, 'Not paused by default')
  })
  await assertControl('play advances frames and pause freezes them', async () => {
    const player = visiblePlayer(), slider = player.locator('[aria-label="Animation frame"]')
    await player.getByRole('button', { name: 'Play animation', exact: true }).click(); await page.waitForTimeout(400)
    assert(Number(await slider.inputValue()) > 0, 'Play did not advance')
    await player.getByRole('button', { name: 'Pause animation', exact: true }).click(); const paused = await slider.inputValue()
    await page.waitForTimeout(300); assert(await slider.inputValue() === paused, 'Pause did not freeze')
  })
  await assertControl('replay restarts the animation', async () => {
    const player = visiblePlayer(), slider = player.locator('[aria-label="Animation frame"]')
    await slider.evaluate(element => { element.value = element.max; element.dispatchEvent(new Event('input', { bubbles: true })) })
    await player.getByRole('button', { name: 'Replay animation', exact: true }).click()
    await page.waitForTimeout(150)
    assert(Number(await slider.inputValue()) < target.frames / 2, 'Replay did not restart near the beginning')
    await player.getByRole('button', { name: 'Pause animation', exact: true }).click()
  })
  await assertControl('JSON edit, invalid data rejection, keyboard isolation, and reset', async () => {
    const player = visiblePlayer(); await player.getByRole('button', { name: '编辑数据 {}', exact: true }).click()
    const editor = player.getByRole('textbox', { name: 'Recipe JSON data' }); const sample = await editor.inputValue()
    await editor.fill('{'); await player.getByRole('button', { name: '应用参数', exact: true }).click(); assert(await player.locator('[role="alert"]').count() === 1, 'Invalid JSON accepted')
    await editor.fill('{}'); await player.getByRole('button', { name: '应用参数', exact: true }).click(); assert(await player.locator('[role="alert"]').count() === 1, 'Schema-invalid data accepted')
    const edited = JSON.parse(sample); edited.title = 'Edited validation title'
    await editor.fill(JSON.stringify(edited)); await editor.press('ArrowRight'); assert(page.url().endsWith(`#/${targetIndex + 2}`), 'Editing key changed slide')
    await player.getByRole('button', { name: '应用参数', exact: true }).click(); assert(await player.locator('[role="alert"]').count() === 0, 'Valid edit rejected')
    await player.getByRole('button', { name: '恢复示例', exact: true }).click(); assert(await editor.inputValue() === sample, 'Reset did not restore exact sample')
    assert(await player.locator('[aria-label="Animation frame"]').inputValue() === '0', 'Reset did not rewind')
  })
  await assertControl('gallery search, category filter, and deep link count', async () => {
    await page.goto(`${base.replace(/#.*$/, '')}#/1`, { waitUntil: 'domcontentloaded' })
    const gallery = page.locator('.dm-gallery:visible').first(); await gallery.locator('.dm-card').first().waitFor()
    assert(await gallery.locator('.dm-card').count() === catalog.length, 'Gallery missing recipe links')
    await page.screenshot({ path: path.join(artifacts, 'gallery.png') })
    await gallery.getByRole('textbox', { name: '搜索配方 / Search recipes' }).fill('RankedReveal')
    assert(await gallery.locator('.dm-card').count() > 0 && await gallery.locator('.dm-card').count() < catalog.length, 'Search did not narrow recipes')
    await gallery.getByRole('textbox', { name: '搜索配方 / Search recipes' }).fill('')
    await gallery.getByLabel('Filter category').selectOption(catalog[0].category)
    assert(await gallery.locator('.dm-card').count() === catalog.filter(c => c.category === catalog[0].category).length, 'Category count mismatch')
  })
} catch (error) { report.failures.push(`Audit setup/control failure: ${error.stack}`) }
finally {
  report.finishedAt = new Date().toISOString()
  if (report.pageErrors.length) report.failures.push(`${report.pageErrors.length} browser page errors`)
  if (report.failedResponses.length) report.failures.push(`${report.failedResponses.length} HTTP error responses`)
  if (report.failedRequests.length) report.failures.push(`${report.failedRequests.length} failed network requests`)
  const comparisons = report.recipes.flatMap(r => r.frames.map(f => f.comparison).filter(Boolean))
  report.fidelity = referenceBase ? { status: 'measured; visual review required', comparedFrames: comparisons.length, expectedFrames: recipes.reduce((n, r) => n + keyframes(r.frames).length, 0), maxMismatchRatio: Math.max(0, ...comparisons.map(c => c.mismatchRatio)), meanMismatchRatio: comparisons.length ? comparisons.reduce((n, c) => n + c.mismatchRatio, 0) / comparisons.length : null } : report.fidelity
  report.smokePassed = report.failures.length === 0
  await fs.writeFile(path.join(artifacts, 'report.json'), JSON.stringify(report, null, 2))
  await browser.close()
}
console.log(JSON.stringify({ smokePassed: report.smokePassed, tested: report.tested, completeCatalog: report.completeCatalog, fidelity: report.fidelity, failures: report.failures }, null, 2))
process.exitCode = report.smokePassed ? 0 : 1

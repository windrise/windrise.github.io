// Optional browser checks: install root test dependencies with `npm ci` first.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';
import { parseSync } from '@slidev/parser';
import { readDecks } from './catalog.mjs';
const root = new URL('../', import.meta.url);
const baseURL = process.env.SLIDES_BASE_URL || 'http://127.0.0.1:4173';
const server = process.env.SLIDES_BASE_URL ? null : spawn(process.execPath, [fileURLToPath(new URL('scripts/preview.mjs', root))], { stdio: ['ignore', 'pipe', 'inherit'] });
let browser;
try {
  if (server) await Promise.race([once(server.stdout, 'data'), once(server, 'exit').then(() => { throw new Error('Preview server stopped before startup'); })]);
  browser = await chromium.launch({ ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.url().startsWith(baseURL) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  assert.equal((await page.goto(`${baseURL}/slides/`)).status(), 200);
  await expect(page.getByRole('heading', { name: '从读懂一篇，到讲清一个问题。' })).toBeVisible();
  await expect(page.getByRole('link', { name: '进入论文库', exact: true })).toHaveAttribute('href', '/reading/reading.html');
  const legacy = page.locator('details').filter({ has: page.getByText('此前的 Slidev 演示', { exact: true }) });
  await expect(legacy).not.toHaveAttribute('open');
  await legacy.locator('summary').click();
  await expect(legacy.getByRole('link').first()).toBeVisible();
  const shots = process.env.SLIDES_SCREENSHOTS;
  if (shots) { await mkdir(shots, { recursive: true }); await page.screenshot({ path: `${shots}/00-catalog.png`, fullPage: true }); }
  const decks = (await readDecks(root)).filter(deck => deck.publish);
  for (const deck of decks) {
    const sourcePath = fileURLToPath(new URL(`decks/${deck.slug}/slides.md`, root));
    const parsed = parseSync(await readFile(sourcePath, 'utf8'), sourcePath);
    for (let i = 1; i <= parsed.slides.length; i++) {
      await page.goto(`${baseURL}/slides/${deck.slug}/#/${i}`);
      const currentSlide = page.locator(`#slide-content [data-slidev-no="${i}"] .slidev-layout`);
      await expect(currentSlide).toBeVisible();
      await page.reload();
      await expect(currentSlide).toBeVisible();
      assert.equal(new URL(page.url()).hash.split('?')[0], `#/${i}`);
      if (shots) {
        await page.waitForTimeout(400); // Let slide transition animations settle for screenshots.
        await page.screenshot({ path: `${shots}/${deck.slug}-${String(i).padStart(2, '0')}.png` });
      }
    }
    // A backward step from page 2 cannot be intercepted by first-page reveal animations.
    if (parsed.slides.length > 1) {
      await page.goto(`${baseURL}/slides/${deck.slug}/#/2`);
      await expect(page.locator('#slide-content [data-slidev-no="2"] .slidev-layout')).toBeVisible();
      await page.keyboard.press('ArrowLeft');
      await page.waitForURL(url => url.hash.split('?')[0] === '#/1');
    }
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseURL}/slides/`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  }
  assert.deepEqual(errors, [], 'no browser errors or missing local resources');
  console.log(`Browser checks passed: ${decks.length} deck(s), static deep links, reload, backward navigation, catalog layout`);
} finally { if (browser) await browser.close(); server?.kill(); }

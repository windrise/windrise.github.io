import { test, expect } from '@playwright/test';

test('profile, verified publications, filters, and award certificate work', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Xueming Fu');
  await expect(page.locator('.publication:visible')).toHaveCount(8);
  await expect(page.locator('.publication:visible').first()).toContainText('ICLR 2026');
  await expect(page.locator('.scholar-summary')).toContainText('228');
  await page.getByRole('button', { name: 'All publications', exact: true }).click();
  await expect(page.locator('.publication:visible')).toHaveCount(18);
  await page.getByRole('button', { name: 'Efficient AI', exact: true }).click();
  const visibleTopics = await page.locator('.publication:visible').evaluateAll(items => items.map(item => item.getAttribute('data-topic')));
  expect(visibleTopics.length).toBeGreaterThan(0);
  expect(visibleTopics.every(topic => topic === 'systems')).toBeTruthy();
  await page.getByRole('button', { name: 'Selected', exact: true }).click();
  await expect(page.locator('.publication:visible')).toHaveCount(8);
  const certificate = await request.get('/files/twinworld-2026-third-place.pdf');
  expect(certificate.ok()).toBeTruthy();
  expect(certificate.headers()['content-type']).toContain('application/pdf');
  await page.goto('/publication/medgmae/');
  await expect(page.locator('.article-date').first()).toHaveText('2026');
  await expect(page.locator('body')).not.toContainText('AAAI');
});

test('3D controls work with reduced motion and keyboard navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const scene = page.locator('#gaussian-scene');
  await expect(scene).toHaveAttribute('data-ready', 'true');
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  const initial = await scene.getAttribute('data-view');
  await page.locator('#gs-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await expect(scene).not.toHaveAttribute('data-view', initial!);
  await page.getByRole('button', { name: 'Reset 3D view' }).click();
  await expect(scene).toHaveAttribute('data-view', initial!);
  await page.getByRole('button', { name: 'Wave', exact: true }).click();
  await expect(scene).toHaveAttribute('data-view', /^wave:/);
  await expect(page.getByRole('button', { name: 'Wave', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Play animation' }).click();
  await expect(scene).toHaveAttribute('data-motion', 'playing');
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1440]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#gaussian-scene')).toHaveAttribute('data-ready', 'true');
    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    await expect(page.getByRole('heading', { name: 'Recognition.', exact: true })).toBeVisible();
  });
}

test('core content and geometry fallback remain available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('.publication:visible')).toHaveCount(18);
  await expect(page.locator('.gs-fallback')).toBeVisible();
  await expect(page.locator('.gs-controls')).toBeHidden();
  await expect(page.getByRole('link', { name: 'View certificate' })).toBeVisible();
  await context.close();
});

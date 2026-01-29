import { test, expect } from '@playwright/test';

test.describe('Papers page smoke tests', () => {
  test('loads and renders papers app', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/papers/`, { waitUntil: 'networkidle' });

    // Core container
    await expect(page.locator('#papers-app')).toBeVisible();

    // Search input
    await expect(page.locator('#search-input')).toBeVisible();

    // At least one paper card
    const cardCount = await page.locator('.paper-card').count();
    expect(cardCount).toBeGreaterThan(0);

    // Results count text
    await expect(page.locator('#results-count')).toContainText('Showing');
  });

  test('theme toggle exists (manual override)', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/papers/`, { waitUntil: 'networkidle' });
    const btn = page.locator('#papers-theme-toggle');
    await expect(btn).toBeVisible();

    // Click cycles through modes and updates label
    const t1 = await btn.textContent();
    await btn.click();
    const t2 = await btn.textContent();
    expect(t2).not.toEqual(t1);

    await btn.click();
    const t3 = await btn.textContent();
    expect(t3).not.toEqual(t2);
  });

  test('notes modal opens from a card', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/papers/`, { waitUntil: 'networkidle' });

    // Open notes on first visible paper
    const firstNotesBtn = page.locator('.paper-card:visible .paper-notes-btn').first();
    await expect(firstNotesBtn).toBeVisible();
    await firstNotesBtn.click();

    const modal = page.locator('#paper-notes-modal');
    await expect(modal).toBeVisible();

    // Has title and a textarea (either raw or EasyMDE-enhanced)
    await expect(page.locator('#paper-notes-title')).toBeVisible();
    await expect(page.locator('#paper-notes-text')).toBeVisible();

    // Close
    await page.locator('[data-notes-close]').first().click();
    await expect(modal).toBeHidden();
  });

  test('selection mode can be toggled', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/papers/`, { waitUntil: 'networkidle' });

    const toggle = page.locator('#toggle-selection-mode');
    await expect(toggle).toBeVisible();
    await toggle.click();

    // Checkboxes should appear
    await expect(page.locator('.paper-checkbox')).toBeVisible();
  });
});

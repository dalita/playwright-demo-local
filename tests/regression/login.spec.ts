import { test, expect } from '@playwright/test';

test('login smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright/);
});
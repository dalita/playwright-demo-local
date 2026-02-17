import { test, expect } from '@playwright/test';

test.describe('Transfer - Regression', () => {
  test('@regression transfer page (demo) should load', async ({ page }) => {
    // Como BASE_URL es playwright.dev, hacemos una demo usando una página real
    await page.goto('/');

    // Validaciones mínimas tipo regresión
    await expect(page).toHaveTitle(/Playwright/i);
    await expect(page.locator('nav')).toBeVisible();

    // Simula "transfer" navegando a un link real (Get Started)
    await page.getByRole('link', { name: /Get started/i }).click();
    await expect(page).toHaveURL(/docs/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
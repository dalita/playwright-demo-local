import { test, expect } from '@playwright/test';

test.describe('Dashboard - Regression', () => {

  test('should load dashboard correctly', async ({ page }) => {
    
    // Usa la BASE_URL que viene desde Jenkins
    await page.goto('/');

    // 1️⃣ Validar que la página cargó
    await expect(page).toHaveTitle(/Playwright|Dashboard|Home/i);

    // 2️⃣ Validar que el body esté visible
    await expect(page.locator('body')).toBeVisible();

    // 3️⃣ Validar que exista algún elemento clave
    // Puedes cambiar esto por un selector real cuando tengas app propia
    const header = page.locator('h1');
    await expect(header).toBeVisible();

  });

});
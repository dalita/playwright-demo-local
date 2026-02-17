import { test, expect } from '@playwright/test';

test.describe('Transfer - Regression', () => {

  test('@regression should complete a transfer flow', async ({ page }) => {

    // 1️⃣ Ir a la pantalla de transferencias
    await page.goto('/transfer'); 
    // Cambia por tu ruta real: /dashboard/transfer etc.

    // 2️⃣ Validar que cargó la página
    await expect(page).toHaveURL(/transfer/);

    // 3️⃣ Completar formulario (selectors genéricos)
    await page.fill('input[name="account"]', '123456789');
    await page.fill('input[name="amount"]', '100');
    await page.fill('textarea[name="description"]', 'Test transfer');

    // 4️⃣ Click en botón transferir
    await page.click('button[type="submit"]');

    // 5️⃣ Validar mensaje de éxito
    const successMessage = page.locator('text=/success|completed|transfer successful/i');
    await expect(successMessage).toBeVisible();

  });

});
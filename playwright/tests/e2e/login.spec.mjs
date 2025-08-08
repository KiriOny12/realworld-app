import { test, expect } from '@playwright/test';

test.describe('Login with existing account spec', () => {
  const existingUser = {
    username: 'Katharina_Bernier',
    password: 's3cret'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('should log in with existing account', async ({ page }) => {
    await page.locator('[data-test=signin-username] input').fill(existingUser.username);
    await page.locator('[data-test=signin-password] input').fill(existingUser.password);

    await page.locator('[data-test=signin-submit]').click();

    await expect(page).not.toHaveURL(/.*\/signin/);
    await expect(page.locator('[data-test=sidenav-username]')).toBeVisible();
    await expect(page.locator('[data-test=sidenav-username]')).toContainText(existingUser.username);
  });

  test('should show error with incorrect password', async ({ page }) => {
    await page.locator('[data-test=signin-username] input').fill(existingUser.username);
    await page.locator('[data-test=signin-password] input').fill('wrongpassword');

    await page.locator('[data-test=signin-submit]').click();

    await expect(page.locator('.MuiAlert-message')).toBeVisible();
    await expect(page).toHaveURL(/.*\/signin/);
  });
});
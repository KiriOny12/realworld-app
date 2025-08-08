import { test, expect } from '@playwright/test';

test.describe('Registration spec', () => {
  let users;
  const newUser = {
    firstName: 'Test',
    lastName: 'User',
    username: `testuser${Date.now()}`, // Unique username using timestamp
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should register a new account', async ({ page }) => {
    await page.locator('[data-test=signup-first-name] input').fill(newUser.firstName);
    await page.locator('[data-test=signup-last-name] input').fill(newUser.lastName);
    await page.locator('[data-test=signup-username] input').fill(newUser.username);
    await page.locator('[data-test=signup-password] input').fill(newUser.password);
    await page.locator('[data-test=signup-confirmPassword] input').fill(newUser.confirmPassword);

    await page.locator('[data-test=signup-submit]').click();

    await expect(page).not.toHaveURL(/.*\/signup/);

    // Try to log in with the new account
    await page.goto('/signin');
    await page.locator('[data-test=signin-username] input').fill(newUser.username);
    await page.locator('[data-test=signin-password] input').fill(newUser.password);
    await page.locator('[data-test=signin-submit]').click();

    await expect(page.locator('[data-test=sidenav-username]')).toBeVisible();
    await expect(page.locator('[data-test=sidenav-username]')).toContainText(newUser.username);
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.locator('[data-test=signup-first-name] input').fill(newUser.firstName);
    await page.locator('[data-test=signup-last-name] input').fill(newUser.lastName);
    await page.locator('[data-test=signup-username] input').fill(`${newUser.username}_mismatch`);
    await page.locator('[data-test=signup-password] input').fill(newUser.password);
    await page.locator('[data-test=signup-confirmPassword] input').fill('DifferentPassword123!');

    await expect(page.locator('[data-test=signup-submit]')).toBeDisabled();
  });
});
import { test, expect } from '@playwright/test';

test.describe('Account details spec', () => {
  const existingUser = {
    username: 'Katharina_Bernier',
    password: 's3cret',
    firstName: 'Edgar',
    lastName: 'Johns',
    email: 'Norene39@yahoo.com',
    phoneNumber: '625-316-9882'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.locator('[data-test=signin-username] input').fill(existingUser.username);
    await page.locator('[data-test=signin-password] input').fill(existingUser.password);
    await page.locator('[data-test=signin-submit]').click();

    await expect(page).not.toHaveURL(/.*\/signin/);
  });

  test('should see account details', async ({ page }) => {
    await page.locator('[data-test=sidenav-user-settings]').click();
    await expect(page).toHaveURL(/.*\/user\/settings/);
    await expect(page.locator('h2')).toContainText('User Settings');

    // Verify all user details are displayed correctly
    await expect(page.locator('[data-test=user-settings-firstName-input]'))
      .toBeVisible();
    await expect(page.locator('[data-test=user-settings-firstName-input]'))
      .toHaveValue(existingUser.firstName);

    await expect(page.locator('[data-test=user-settings-lastName-input]'))
      .toBeVisible();
    await expect(page.locator('[data-test=user-settings-lastName-input]'))
      .toHaveValue(existingUser.lastName);

    await expect(page.locator('[data-test=user-settings-email-input]'))
      .toBeVisible();
    await expect(page.locator('[data-test=user-settings-email-input]'))
      .toHaveValue(existingUser.email);

    await expect(page.locator('[data-test=user-settings-phoneNumber-input]'))
      .toBeVisible();
    await expect(page.locator('[data-test=user-settings-phoneNumber-input]'))
      .toHaveValue(existingUser.phoneNumber);

    await expect(page.locator('[data-test=user-settings-submit]'))
      .toBeVisible();
    await expect(page.locator('[data-test=user-settings-submit]'))
      .toContainText('Save');
  });

  test('should see account balance', async ({ page }) => {
    await expect(page.locator('[data-test=sidenav-user-balance]'))
      .toBeVisible();
    await expect(page.locator('[data-test=sidenav-user-balance]'))
      .toContainText('$1,681.37');

    await expect(page.locator('[data-test=sidenav-user-balance]').locator('..').locator('h6').last())
      .toContainText('Account Balance');
  });
});
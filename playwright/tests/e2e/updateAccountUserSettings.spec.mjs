import { test, expect } from '@playwright/test';

test.describe('Update User Settings spec', () => {
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

  test.afterEach(async ({ page }) => {
        // Restore original user data after each test
        await page.locator('[data-test="sidenav-user-settings"]').click();
        await expect(page).toHaveURL(/.*\/user\/settings/);
        await page.waitForSelector('[data-test="user-settings-firstName-input"]');

        const firstNameInput = page.locator('[data-test="user-settings-firstName-input"]');
        const lastNameInput = page.locator('[data-test="user-settings-lastName-input"]');
        const emailInput = page.locator('[data-test="user-settings-email-input"]');
        const phoneInput = page.locator('[data-test="user-settings-phoneNumber-input"]');
        const submitButton = page.locator('[data-test="user-settings-submit"]');

        await firstNameInput.fill(existingUser.firstName);
        await lastNameInput.fill(existingUser.lastName);
        await emailInput.fill(existingUser.email);
        await phoneInput.fill(existingUser.phoneNumber);
        await submitButton.click();

        // Verify the original full name is restored
        const expectedOriginalFullName = `${existingUser.firstName} ${existingUser.lastName.charAt(0)}`;
        const fullNameElement = page.locator('[data-test="sidenav-user-full-name"]');
        await expect(fullNameElement).toContainText(expectedOriginalFullName);
  });

  test('should update user settings and reflect changes in full name', async ({ page }) => {
    // Generate random test data
    const newUserData = {
      firstName: `TestFirst${Math.floor(Math.random() * 1000)}`,
      lastName: `TestLast${Math.floor(Math.random() * 1000)}`,
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      phoneNumber: `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    };

    await page.locator('[data-test="sidenav-user-settings"]').click();

    // Assert that user settings page is opened
    await expect(page).toHaveURL(/.*\/user\/settings/);
    await expect(page.locator('h2')).toContainText('User Settings');

    await page.waitForSelector('[data-test="user-settings-firstName-input"]');

    const firstNameInput = page.locator('[data-test="user-settings-firstName-input"]');
    const lastNameInput = page.locator('[data-test="user-settings-lastName-input"]');
    const emailInput = page.locator('[data-test="user-settings-email-input"]');
    const phoneInput = page.locator('[data-test="user-settings-phoneNumber-input"]');
    const submitButton = page.locator('[data-test="user-settings-submit"]');

    await firstNameInput.fill(newUserData.firstName);
    await lastNameInput.fill(newUserData.lastName);
    await emailInput.fill(newUserData.email);
    await phoneInput.fill(newUserData.phoneNumber);

    await submitButton.click();

    const expectedFullName = `${newUserData.firstName} ${newUserData.lastName.charAt(0)}`;
    const fullNameElement = page.locator('[data-test="sidenav-user-full-name"]');
    await expect(fullNameElement).toContainText(expectedFullName);
  });
});
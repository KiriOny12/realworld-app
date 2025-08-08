import { test, expect } from '@playwright/test';

test.describe('Add and delete bank account spec', () => {
  const existingUser = {
    username: 'Katharina_Bernier',
    password: 's3cret',
    firstName: 'Edgar',
    lastName: 'Johns',
    email: 'Norene39@yahoo.com',
    phoneNumber: '625-316-9882'
  };

  const accountName = `dummy_account_${Date.now()}`;
  const routingNumber = '123-12345';
  const accountNumber = '1234567890';

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.locator('[data-test=signin-username] input').fill(existingUser.username);
    await page.locator('[data-test=signin-password] input').fill(existingUser.password);
    await page.locator('[data-test=signin-submit]').click();

    await expect(page).not.toHaveURL(/.*\/signin/);
  });

  test('should create a new bank account', async ({ page }) => {
    await page.locator('[data-test="sidenav-bankaccounts"]').click();
    await expect(page).toHaveURL(/.*\/bankaccounts/);
    await page.locator('[data-test="bankaccount-new"]').click();

    const bankNameInput = page.locator('[data-test="bankaccount-bankName-input"] input');
    const routingInput = page.locator('[data-test="bankaccount-routingNumber-input"] input');
    const accountInput = page.locator('[data-test="bankaccount-accountNumber-input"] input');
    const submitButton = page.locator('[data-test="bankaccount-submit"]');

    await bankNameInput.fill(accountName);
    await routingInput.fill(routingNumber);
    await accountInput.fill(accountNumber);
    await submitButton.click();

    // Check that the bank account list is visible
    const bankAccountList = page.locator('[data-test="bankaccount-list"]');
    await expect(bankAccountList).toBeVisible();

    // Find the specific account item by filtering for the account name
    const newAccountItem = page.locator('[data-test="bankaccount-list"] li').filter({ hasText: accountName });
    await expect(newAccountItem).toBeVisible();
    await expect(newAccountItem).toContainText(accountName);
  });

  test('should delete the bank account', async ({ page }) => {
    await page.locator('[data-test="sidenav-bankaccounts"]').click();
    await expect(page).toHaveURL(/.*\/bankaccounts/);

    // Find the specific account item
    const accountItem = page.locator('[data-test="bankaccount-list"] li').filter({ hasText: accountName });

    const deleteButton = accountItem.locator('[data-test="bankaccount-delete"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Verify the account is marked as deleted
    const deletedAccountItem = page.locator('[data-test="bankaccount-list"] li').filter({ hasText: accountName });
    await expect(deletedAccountItem).toContainText('(Deleted)');

    // Verify the delete button is no longer visible
    const deletedItemDeleteButton = deletedAccountItem.locator('[data-test="bankaccount-delete"]');
    await expect(deletedItemDeleteButton).not.toBeVisible();
  });
});
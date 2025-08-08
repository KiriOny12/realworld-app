import { test, expect } from '@playwright/test';

test.describe('Account transaction history spec', () => {
  const existingUser = {
    username: 'Katharina_Bernier',
    password: 's3cret',
    firstName: 'Edgar',
    lastName: 'Johns',
    email: 'Norene39@yahoo.com',
    phoneNumber: '625-316-9882'
  };

  const TRANSACTION_ID = '183VHWyuQMS';

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.locator('[data-test=signin-username] input').fill(existingUser.username);
    await page.locator('[data-test=signin-password] input').fill(existingUser.password);
    await page.locator('[data-test=signin-submit]').click();

    await expect(page).not.toHaveURL(/.*\/signin/);
  });

  test('should see account transaction history', async ({ page }) => {
    // Assert that at least one transaction is visible
    const transactionItems = page.locator('[data-test^="transaction-item-"]');
    await expect(transactionItems.first()).toBeVisible();

    const specificTransaction = page.locator(`[data-test="transaction-item-${TRANSACTION_ID}"]`);

    // Assert that the transaction amount is present and visible
    await expect(specificTransaction.locator(`[data-test="transaction-amount-${TRANSACTION_ID}"]`))
      .toBeVisible();
    await expect(specificTransaction.locator(`[data-test="transaction-amount-${TRANSACTION_ID}"]`))
      .toContainText('$');

    await expect(specificTransaction.locator(`[data-test="transaction-sender-${TRANSACTION_ID}"]`))
      .toBeVisible();
    await expect(specificTransaction.locator(`[data-test="transaction-sender-${TRANSACTION_ID}"]`))
      .not.toBeEmpty();

    await expect(specificTransaction.locator(`[data-test="transaction-action-${TRANSACTION_ID}"]`))
      .toBeVisible();
    await expect(specificTransaction.locator(`[data-test="transaction-action-${TRANSACTION_ID}"]`))
      .not.toBeEmpty();

    await expect(specificTransaction.locator(`[data-test="transaction-receiver-${TRANSACTION_ID}"]`))
      .toBeVisible();
    await expect(specificTransaction.locator(`[data-test="transaction-receiver-${TRANSACTION_ID}"]`))
      .not.toBeEmpty();
  });
});
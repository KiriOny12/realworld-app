import { test, expect } from '@playwright/test';

test.describe('Account transaction details spec', () => {
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

  test('should see transaction details page', async ({ page }) => {
    await page.locator(`[data-test="transaction-item-${TRANSACTION_ID}"]`).click();
    await expect(page).toHaveURL(new RegExp(`.*\/transaction\/${TRANSACTION_ID}`));

    await expect(page.locator('[data-test="transaction-detail-header"]'))
      .toBeVisible();
    await expect(page.locator('[data-test="transaction-detail-header"]'))
      .toContainText('Transaction Detail');

    await expect(page.locator(`[data-test="transaction-sender-${TRANSACTION_ID}"]`))
      .toBeVisible();
    await expect(page.locator(`[data-test="transaction-sender-${TRANSACTION_ID}"]`))
      .toContainText('Kaylin Homenick');

    await expect(page.locator(`[data-test="transaction-action-${TRANSACTION_ID}"]`))
      .toBeVisible();
    await expect(page.locator(`[data-test="transaction-action-${TRANSACTION_ID}"]`))
      .toContainText('paid');

    await expect(page.locator(`[data-test="transaction-receiver-${TRANSACTION_ID}"]`))
      .toBeVisible();
    await expect(page.locator(`[data-test="transaction-receiver-${TRANSACTION_ID}"]`))
      .toContainText('Arely Kertzmann');

    await expect(page.locator(`[data-test="transaction-amount-${TRANSACTION_ID}"]`))
      .toBeVisible();
    await expect(page.locator(`[data-test="transaction-amount-${TRANSACTION_ID}"]`))
      .toContainText('-$80.31');

    await expect(page.locator('[data-test="transaction-description"]'))
      .toBeVisible();
    await expect(page.locator('[data-test="transaction-description"]'))
      .toContainText('Payment: bDjUb4ir5O to qywYp6hS0U');

    await expect(page.locator('[data-test="transaction-sender-avatar"]')).toBeVisible();
    await expect(page.locator('[data-test="transaction-receiver-avatar"]')).toBeVisible();
  });
});
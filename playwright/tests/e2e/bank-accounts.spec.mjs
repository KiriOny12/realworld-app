import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const usersPath = path.join(__dirname, '../../fixtures/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

test.describe('Bank Accounts', () => {

  test.beforeEach(async ({ page }) => {
    const { username, password } = users.testuser;

    await page.goto(`${BASE_URL}/signin`);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('[data-test="signin-submit"]');
    await expect(page).toHaveURL(/.*\/$/);
  });

  test('Should add new bank account', async ({ page }) => {
    await page.click('[data-test="sidenav-bankaccounts"]');
    await page.click('[data-test="bankaccount-new"]');

    const timestamp = Date.now();
    const bankName = `Bank${timestamp}`;

    await page.locator('[data-test="bankaccount-bankName-input"] input').fill(bankName);
    await page.locator('[data-test="bankaccount-routingNumber-input"] input').fill('123456789');
    await page.locator('[data-test="bankaccount-accountNumber-input"] input').fill('987654321');
    await page.click('[data-test="bankaccount-submit"]');

    const newAccount = page.locator('[data-test^="bankaccount-list-item"]', { hasText: bankName });
    await expect(newAccount).toBeVisible({ timeout: 10000 });
  });

  test('Should delete bank account', async ({ page }) => {
    await page.click('[data-test="sidenav-bankaccounts"]');

    const accountItem = page
      .locator('[data-test^="bankaccount-list-item"]')
      .filter({ has: page.locator('[data-test="bankaccount-delete"]') })
      .first();

    if (await accountItem.count() === 0) return;

    await accountItem.locator('[data-test="bankaccount-delete"]').click();

    await expect(accountItem).toContainText('Delete', { timeout: 10000 }); 
    await expect(accountItem.locator('[data-test="bankaccount-delete"]')).toHaveCount(0);
  });

});

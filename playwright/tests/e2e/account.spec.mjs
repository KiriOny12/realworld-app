import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';


const BASE_URL = 'http://localhost:3000';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const usersPath = path.join(__dirname, '../../fixtures/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));


test.describe('Account Details', () => {

  test.beforeEach(async ({ page }) => {
    const { username, password } = users.testuser;

    await page.goto(`${BASE_URL}/signin`);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('[data-test="signin-submit"]');
    await expect(page).toHaveURL(/.*\/$/);
  });

  test('Should see account balance', async ({ page }) => {
    await expect(page.locator('[data-test="sidenav-user-balance"]')).toBeVisible();
    const balanceText = await page.locator('[data-test="sidenav-user-balance"]').textContent();
    expect(balanceText).toContain('$');
    expect(balanceText).toMatch(/\$[\d,]+\.\d{2}/); 
  });

  test('Should see account details', async ({ page }) => {
    await page.click('[data-test="sidenav-user-settings"]');
    await expect(page.locator('[data-test="user-settings-firstName-input"]')).toBeVisible();
    await expect(page.locator('[data-test="user-settings-lastName-input"]')).toBeVisible();
    await expect(page.locator('[data-test="user-settings-email-input"]')).toBeVisible();
    await expect(page.locator('[data-test="user-settings-phoneNumber-input"]')).toBeVisible();
  });

  test('Should see account transactions history', async ({ page }) => {
    await expect(page.locator('[data-test="transaction-list"]')).toBeVisible();
    const transactions = page.locator('[data-test^="transaction-item"]');
    const count = await transactions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Should see account transaction details', async ({ page }) => {
    const firstTransaction = page.locator('[data-test^="transaction-item"]').first();
    await firstTransaction.click();
    await expect(page.locator('[data-test="transaction-detail-header"]')).toBeVisible();
    await expect(page.locator('[data-test^="transaction-amount-"]')).toBeVisible();
  });

  test('Should update account user settings', async ({ page }) => {
    await page.click('[data-test="sidenav-user-settings"]');
    await page.fill('[data-test="user-settings-firstName-input"]', 'UpdatedFirstName');
    await page.fill('[data-test="user-settings-lastName-input"]', 'UpdatedLastName');
    await page.click('[data-test="user-settings-submit"]');
    await expect(page.locator('[data-test="user-settings-firstName-input"]')).toHaveValue('UpdatedFirstName');
    await expect(page.locator('[data-test="user-settings-lastName-input"]')).toHaveValue('UpdatedLastName');
    await expect(page.locator('[data-test="sidenav-user-full-name"]')).toContainText('UpdatedFirstName');
  });

});

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';


const BASE_URL = 'http://localhost:3000';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const usersPath = path.join(__dirname, '../../fixtures/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));


test.describe('Authentication', () => {

  test('Should register a new account', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    const timestamp = Date.now();
    const username = `testuser${timestamp}`;

    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', 's3cret');
    await page.fill('input[name="confirmPassword"]', 's3cret');
    await page.click('[data-test="signup-submit"]');

    await expect(page).toHaveURL(/.*signin/);

    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', 's3cret');
    await page.click('[data-test="signin-submit"]');
    await expect(page).toHaveURL(/.*\/$/);

    await expect(page.locator('[data-test="user-onboarding-dialog"]')).toBeVisible();
    await expect(page.locator('[data-test="user-onboarding-dialog-title"]')).toContainText('Get Started with Real World App');
  });

  test('Should log in with existing account', async ({ page }) => {
    const { username, password } = users.testuser;

    await page.goto(`${BASE_URL}/signin`);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('[data-test="signin-submit"]');

    await expect(page).toHaveURL(/.*\/$/);
    await expect(page.locator('[data-test="sidenav-username"]')).toBeVisible();
    await expect(page.locator('[data-test="sidenav-username"]')).toContainText(username);
  });

});

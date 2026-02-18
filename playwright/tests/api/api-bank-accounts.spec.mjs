import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';


const API_BASE_URL = 'http://localhost:3002';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const usersPath = path.join(__dirname, '../../fixtures/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));


test.describe('Bank Accounts API', () => {
  let cookies;

  test.beforeAll(async ({ request }) => {
    const { username, password } = users.testuser;

    const loginResponse = await request.post(`${API_BASE_URL}/login`, {
      data: { username, password }
    });

    expect(loginResponse.ok()).toBeTruthy();
    cookies = loginResponse.headers()['set-cookie'];
  });

  test('Gets a list of bank accounts for user (GET /bankAccounts)', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/bankAccounts`, {
      headers: { Cookie: cookies }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBeTruthy();

    if (data.results.length > 0) {
      const firstAccount = data.results[0];
      expect(firstAccount).toHaveProperty('id');
      expect(firstAccount).toHaveProperty('bankName');
      expect(firstAccount).toHaveProperty('accountNumber');
      expect(firstAccount).toHaveProperty('routingNumber');
    }

    console.log(`Found ${data.results.length} bank accounts`);
  });

  test('Deletes a bank account (DELETE /:bankAccountId)', async ({ request }) => {
    const createResponse = await request.post(`${API_BASE_URL}/bankAccounts`, {
      headers: { Cookie: cookies },
      data: {
        bankName: 'API Test Bank',
        accountNumber: '111222333',
        routingNumber: '444555666'
      }
    });

    expect(createResponse.ok()).toBeTruthy();

    const createdData = await createResponse.json();
    const createdAccount = createdData.account;
    const bankAccountId = createdAccount.id;

    expect(createdAccount).toBeDefined();
    expect(bankAccountId).toBeDefined();

    console.log(`Created bank account with ID: ${bankAccountId}`);

    const deleteResponse = await request.delete(
      `${API_BASE_URL}/bankAccounts/${bankAccountId}`,
      { headers: { Cookie: cookies } }
    );

    expect(deleteResponse.ok()).toBeTruthy();

    const listResponse = await request.get(`${API_BASE_URL}/bankAccounts`, {
      headers: { Cookie: cookies }
    });

    const accounts = await listResponse.json();
    const deletedAccount = accounts.results.find(acc => acc.id === bankAccountId);

    if (deletedAccount) {
      expect(deletedAccount.isDeleted).toBe(true);
      console.log('Bank account soft-deleted (marked as deleted)');
    } else {
      console.log('Bank account completely removed from list');
    }
  });
});

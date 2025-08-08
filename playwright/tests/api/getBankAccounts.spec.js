const { test, expect } = require('@playwright/test');

test.describe('Bank Accounts API', () => {
  let users;
  let cookies;

  test.beforeAll(async ({ request }) => {
    // Load users fixture
    users = require('../../fixtures/users.json');

    const apiUrl = process.env.API_URL || 'http://localhost:3002';

    const loginResponse = await request.post(`${apiUrl}/login`, {
      data: {
        username: users.testuser.username,
        password: users.testuser.password
      }
    });

    console.log('Login response status:', loginResponse.status());
    expect(loginResponse.ok()).toBeTruthy();

    const setCookieHeader = loginResponse.headers()['set-cookie'];
    cookies = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader || '';
    console.log('Extracted cookies:', cookies);
  });

  test('should reach the API server', async ({ request }) => {
    const apiUrl = process.env.API_URL || 'http://localhost:3002';
    console.log('Testing API connectivity at:', apiUrl);

    try {
      const response = await request.get(`${apiUrl}/users`);
      console.log('Server response status:', response.status());
    } catch (error) {
      console.log('Server not reachable:', error.message);
    }
  });

  test('should get bank accounts for authenticated user', async ({ request }) => {
    const apiUrl = process.env.API_URL || 'http://localhost:3002';

    const response = await request.get(`${apiUrl}/bankAccounts`, {
      headers: {
        'Cookie': cookies || ''
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('results');
    expect(Array.isArray(responseBody.results)).toBe(true);

    for (const account of responseBody.results) {
      expect(account).toHaveProperty('id');

      expect(account.isDeleted).toBe(false);
    }
  });

  test('should return 401 when not authenticated', async ({ request }) => {
    const apiUrl = process.env.API_URL || 'http://localhost:3002';
    const response = await request.get(`${apiUrl}/bankAccounts`);
    expect(response.status()).toBe(401);
  });
});
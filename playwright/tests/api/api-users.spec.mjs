import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';


const API_BASE_URL = 'http://localhost:3002';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const usersPath = path.join(__dirname, '../../fixtures/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));


test.describe('Users API', () => {
  let cookies;

  test.beforeAll(async ({ request }) => {
    const { username, password } = users.testuser;
    console.log(`Logging in as ${username}...`);

    const loginResponse = await request.post(`${API_BASE_URL}/login`, {
      data: { username, password }
    });

    expect(loginResponse.ok()).toBeTruthy();
    expect(loginResponse.status()).toBe(200);

    cookies = loginResponse.headers()['set-cookie'];
    expect(cookies).toBeDefined();
    console.log('Login successful');
  });

  test('Get a user profile by username (GET /users/profile/:username)', async ({ request }) => {
    const username = 'Tavares_Barrows';
    console.log(`Fetching profile for user: ${username}...`);

    const response = await request.get(`${API_BASE_URL}/users/profile/${username}`, {
      headers: { Cookie: cookies }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('user');

    const user = data.user;
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');

    console.log(`Retrieved profile: ${user.firstName} ${user.lastName} (@${user.username})`);
  });

  test('Gets list of users (GET /users)', async ({ request }) => {
    console.log('Fetching users list...');

    const response = await request.get(`${API_BASE_URL}/users`, {
      headers: { Cookie: cookies }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBeTruthy();
    expect(data.results.length).toBeGreaterThan(0);

    console.log(`Found ${data.results.length} user(s)`);

    const firstUser = data.results[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('username');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(typeof firstUser.id).toBe('string');
    expect(typeof firstUser.username).toBe('string');

    console.log(`First user: ${firstUser.firstName} ${firstUser.lastName} (@${firstUser.username})`);

    const tavares = data.results.find(user => user.username === 'Tavares_Barrows');
    expect(tavares).toBeDefined();
    console.log('Current user (Tavares_Barrows) found in list');
  });
});

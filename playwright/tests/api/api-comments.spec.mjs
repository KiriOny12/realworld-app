import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';


const API_BASE_URL = 'http://localhost:3002';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const usersPath = path.join(__dirname, '../../fixtures/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));


test.describe('Comments API', () => {
  let cookies;
  let transactionId;

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

    console.log('Fetching transactions...');
    const transactionsResponse = await request.get(`${API_BASE_URL}/transactions`, {
      headers: { Cookie: cookies },
    });

    expect(transactionsResponse.ok()).toBeTruthy();

    const transactions = await transactionsResponse.json();
    expect(transactions).toHaveProperty('results');
    expect(transactions.results.length).toBeGreaterThan(0);

    transactionId = transactions.results[1].id;
    expect(transactionId).toBeDefined();
    console.log(`Using transaction ID: ${transactionId}`);
  });

  test('Creates a comment and verifies it exists (POST + GET /comments/:transactionId)', async ({ request }) => {
    expect(transactionId).toBeDefined();

    const commentContent = `API Test Comment - ${Date.now()}`;
    console.log(`Creating comment: "${commentContent}"`);

    const postResponse = await request.post(`${API_BASE_URL}/comments/${transactionId}`, {
      headers: { Cookie: cookies },
      data: { content: commentContent },
    });

    expect(postResponse.ok()).toBeTruthy();
    expect(postResponse.status()).toBe(200);

    const postText = await postResponse.text();
    expect(postText).toBe('OK');

    console.log('Comment created, verifying via GET...');
    const getResponse = await request.get(`${API_BASE_URL}/comments/${transactionId}`, {
      headers: { Cookie: cookies },
    });

    expect(getResponse.ok()).toBeTruthy();
    expect(getResponse.status()).toBe(200);

    const data = await getResponse.json();
    expect(data).toHaveProperty('comments');
    expect(Array.isArray(data.comments)).toBe(true);
    expect(data.comments.length).toBeGreaterThan(0);

    const createdComment = data.comments.find(c => c.content === commentContent);
    expect(createdComment).toBeDefined();
    expect(createdComment.transactionId).toBe(transactionId);
    expect(typeof createdComment.id).toBe('string');

    console.log(`Comment verified with ID: ${createdComment.id}`);
  });
});

import { expect, test } from "@playwright/test";

const apiUrl = "http://localhost:3002";
const username = "Katharina_Bernier";
const password = "s3cret";

test.describe("Account API", () => {
  let currentUser;

  test.beforeEach(async ({ request }) => {
    const seedResponse = await request.post(`${apiUrl}/testData/seed`);
    expect(seedResponse.ok()).toBeTruthy();
    const loginResponse = await request.post(`${apiUrl}/login`, {
      data: { username, password },
    });
    expect(loginResponse.ok()).toBeTruthy();
    currentUser = (await loginResponse.json()).user;
  });

  test("gets a list of bank accounts for the user", async ({ request }) => {
    const response = await request.get(`${apiUrl}/bankAccounts`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results.every((account) => account.userId === currentUser.id)).toBeTruthy();
  });

  test("deletes a bank account", async ({ request }) => {
    const createResponse = await request.post(`${apiUrl}/bankAccounts`, {
      data: {
        bankName: "API Test Bank",
        routingNumber: "123456789",
        accountNumber: "1234567890",
      },
    });
    const bankAccountId = (await createResponse.json()).account.id;
    const response = await request.delete(`${apiUrl}/bankAccounts/${bankAccountId}`);
    expect(response.status()).toBe(200);

    const getResponse = await request.get(`${apiUrl}/bankAccounts/${bankAccountId}`);
    const body = await getResponse.json();
    expect(getResponse.status()).toBe(200);
    expect(body.account.id).toBe(bankAccountId);
    expect(body.account.isDeleted).toBe(true);
  });

  test("gets a user profile by username", async ({ request }) => {
    const response = await request.get(`${apiUrl}/users/profile/${username}`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.user).toEqual(expect.objectContaining({ firstName: "Edgar", lastName: "Johns" }));
    expect(Object.keys(body.user).sort()).toEqual(["avatar", "firstName", "lastName"]);
  });

  test("creates a new comment for a transaction", async ({ request }) => {
    const transactionResponse = await request.get(`${apiUrl}/transactions`);
    const transactionId = (await transactionResponse.json()).results[0].id;
    const content = `API comment ${Date.now()}`;
    const createResponse = await request.post(`${apiUrl}/comments/${transactionId}`, {
      data: { content },
    });

    expect(createResponse.status()).toBe(200);
    const commentsResponse = await request.get(`${apiUrl}/comments/${transactionId}`);
    const comments = (await commentsResponse.json()).comments;
    expect(comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content, userId: currentUser.id, transactionId }),
      ])
    );
  });

  test("gets a list of users", async ({ request }) => {
    const response = await request.get(`${apiUrl}/users`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results.map((candidate) => candidate.id)).not.toContain(currentUser.id);
  });
});

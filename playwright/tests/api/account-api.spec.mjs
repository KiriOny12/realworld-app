import { expect, test } from "@playwright/test";

const apiUrl = "http://localhost:3002";

test.describe("Account API", () => {
  test.beforeEach(async ({ request }) => {
    expect((await request.post(`${apiUrl}/testData/seed`)).ok()).toBeTruthy();
    expect(
      (
        await request.post(`${apiUrl}/login`, {
          data: { username: "Katharina_Bernier", password: "s3cret" },
        })
      ).ok()
    ).toBeTruthy();
  });

  test("gets a list of bank accounts for the user", async ({ request }) => {
    const response = await request.get(`${apiUrl}/bankAccounts`);
    expect(response.status()).toBe(200);
    const { results } = await response.json();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toEqual(
      expect.objectContaining({ id: expect.any(String), bankName: expect.any(String) })
    );
  });

  test("deletes a bank account", async ({ request }) => {
    const { results } = await (await request.get(`${apiUrl}/bankAccounts`)).json();
    const account = results.find(({ isDeleted }) => !isDeleted);
    const response = await request.delete(`${apiUrl}/bankAccounts/${account.id}`);
    expect(response.status()).toBe(200);
    const updated = await (await request.get(`${apiUrl}/bankAccounts`)).json();
    expect(updated.results.find(({ id }) => id === account.id).isDeleted).toBe(true);
  });

  test("gets a user profile by username", async ({ request }) => {
    const response = await request.get(`${apiUrl}/users/profile/Katharina_Bernier`);
    expect(response.status()).toBe(200);
    expect((await response.json()).user).toEqual(
      expect.objectContaining({ firstName: "Edgar", lastName: "Johns" })
    );
  });

  test("creates a new comment for a transaction", async ({ request }) => {
    const { results } = await (await request.get(`${apiUrl}/testData/transactions`)).json();
    const response = await request.post(`${apiUrl}/comments/${results[0].id}`, {
      data: { content: "API test comment" },
    });
    expect(response.status()).toBe(200);
  });

  test("gets a list of users", async ({ request }) => {
    const response = await request.get(`${apiUrl}/users`);
    expect(response.status()).toBe(200);
    const { results } = await response.json();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((user) => user.username === "Katharina_Bernier")).toBeFalsy();
  });
});

import { expect, test } from "@playwright/test";

const webUrl = "http://localhost:3000";
const apiUrl = "http://localhost:3002";
const user = { username: "Katharina_Bernier", password: "s3cret" };

const byTestId = (page, id) => page.locator(`[data-test="${id}"]`);

const isGraphqlOperation = (response, operationName) => {
  if (response.url() !== `${apiUrl}/graphql` || response.request().method() !== "POST") {
    return false;
  }

  return response.request().postDataJSON().operationName === operationName;
};

async function login(page) {
  await page.goto(`${webUrl}/signin`);
  await page.locator('input[name="username"]').fill(user.username);
  await page.locator('input[name="password"]').fill(user.password);
  await Promise.all([
    page.waitForResponse((response) => response.url() === `${apiUrl}/login`),
    byTestId(page, "signin-submit").click(),
  ]);
  await expect(byTestId(page, "sidenav-username")).toContainText(user.username);
}

test.describe("Account journeys", () => {
  test.beforeEach(async ({ request }) => {
    const response = await request.post(`${apiUrl}/testData/seed`);
    expect(response.ok()).toBeTruthy();
  });

  test("should register a new account", async ({ page }) => {
    const username = `new_user_${Date.now()}`;

    await page.goto(`${webUrl}/signup`);
    await page.locator('input[name="firstName"]').fill("New");
    await page.locator('input[name="lastName"]').fill("User");
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill("s3cret");
    await page.locator('input[name="confirmPassword"]').fill("s3cret");
    const [response] = await Promise.all([
      page.waitForResponse((candidate) => candidate.url() === `${apiUrl}/users`),
      byTestId(page, "signup-submit").click(),
    ]);

    expect(response.status()).toBe(201);
    await expect(page).toHaveURL(`${webUrl}/signin`);
  });

  test("should log in with an existing account", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(`${webUrl}/`);
  });

  test("should see account details", async ({ page }) => {
    await login(page);
    await expect(byTestId(page, "sidenav-user-full-name")).toContainText("Edgar J");
    await expect(byTestId(page, "sidenav-username")).toContainText(user.username);
  });

  test("should see account balance", async ({ page }) => {
    await login(page);
    await expect(byTestId(page, "sidenav-user-balance")).toHaveText(/^\$[\d,]+\.\d{2}$/);
    await expect(page.locator("text=Account Balance")).toBeVisible();
  });

  test("should see account transactions history", async ({ page }) => {
    await login(page);
    await byTestId(page, "nav-personal-tab").click();
    await expect(page).toHaveURL(`${webUrl}/personal`);
    await expect(byTestId(page, "list-skeleton")).toHaveCount(0);
    await expect(byTestId(page, "transaction-list")).toBeVisible();
    await expect(page.locator('[data-test^="transaction-item-"]').first()).toBeVisible();
  });

  test("should see account transaction details", async ({ page }) => {
    await login(page);
    await byTestId(page, "nav-personal-tab").click();
    await expect(byTestId(page, "list-skeleton")).toHaveCount(0);
    const transaction = page.locator('[data-test^="transaction-item-"]').first();
    const testId = await transaction.getAttribute("data-test");
    const transactionId = testId.replace("transaction-item-", "");
    await transaction.click();

    await expect(page).toHaveURL(`${webUrl}/transaction/${transactionId}`);
    await expect(byTestId(page, "transaction-detail-header")).toContainText("Transaction Detail");
    await expect(byTestId(page, "transaction-description")).toBeVisible();
  });

  test("should update account user settings", async ({ page }) => {
    await login(page);
    await byTestId(page, "sidenav-user-settings").click();
    await expect(page).toHaveURL(`${webUrl}/user/settings`);
    await byTestId(page, "user-settings-firstName-input").fill("Updated");
    const [response] = await Promise.all([
      page.waitForResponse(
        (candidate) =>
          candidate.url().includes(`${apiUrl}/users/`) && candidate.request().method() === "PATCH"
      ),
      byTestId(page, "user-settings-submit").click(),
    ]);

    expect(response.status()).toBe(204);
    await expect(byTestId(page, "sidenav-user-full-name")).toContainText("Updated");
  });

  test("should add a new bank account", async ({ page }) => {
    await login(page);
    await byTestId(page, "sidenav-bankaccounts").click();
    await byTestId(page, "bankaccount-new").click();
    await page.locator('input[name="bankName"]').fill("Automation Bank");
    await page.locator('input[name="routingNumber"]').fill("123456789");
    await page.locator('input[name="accountNumber"]').fill("1234567890");
    const [response] = await Promise.all([
      page.waitForResponse((candidate) => isGraphqlOperation(candidate, "CreateBankAccount")),
      byTestId(page, "bankaccount-submit").click(),
    ]);

    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(`${webUrl}/bankaccounts`);
    await expect(byTestId(page, "bankaccount-list")).toContainText("Automation Bank");
  });

  test("should delete a bank account", async ({ page }) => {
    await login(page);
    await byTestId(page, "sidenav-bankaccounts").click();
    await expect(byTestId(page, "bankaccount-list")).toBeVisible();
    const [response] = await Promise.all([
      page.waitForResponse((candidate) => isGraphqlOperation(candidate, "DeleteBankAccount")),
      byTestId(page, "bankaccount-delete").first().click(),
    ]);

    expect(response.status()).toBe(200);
    await expect(byTestId(page, "bankaccount-list")).toContainText("(Deleted)");
    await expect(byTestId(page, "bankaccount-delete")).toHaveCount(0);
  });
});

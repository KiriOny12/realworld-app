import { expect, test } from "@playwright/test";

const apiUrl = "http://localhost:3002";
const username = "Katharina_Bernier";

const byTestId = (page, value) => page.locator(`[data-test="${value}"]`);
const inputByTestId = (page, value) => byTestId(page, value).locator("input");
const login = async (page) => {
  await page.goto("/signin");
  await inputByTestId(page, "signin-username").fill(username);
  await inputByTestId(page, "signin-password").fill("s3cret");
  await byTestId(page, "signin-submit").click();
  await expect(byTestId(page, "sidenav-username")).toContainText(username);
};

test.describe("Account", () => {
  test.beforeEach(async ({ request }) => {
    const response = await request.post(`${apiUrl}/testData/seed`);
    expect(response.ok()).toBeTruthy();
  });

  test("should register a new account", async ({ page }) => {
    await page.goto("/signup");
    await inputByTestId(page, "signup-first-name").fill("Test");
    await inputByTestId(page, "signup-last-name").fill("Student");
    await inputByTestId(page, "signup-username").fill(`student_${Date.now()}`);
    await inputByTestId(page, "signup-password").fill("s3cret");
    await inputByTestId(page, "signup-confirmPassword").fill("s3cret");
    await byTestId(page, "signup-submit").click();
    await expect(page).toHaveURL(/\/signin$/);
  });

  test("should log in with an existing account", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/$/);
  });

  test("should see account details", async ({ page }) => {
    await login(page);
    await expect(byTestId(page, "sidenav-user-full-name")).toContainText("Edgar J");
    await expect(byTestId(page, "sidenav-username")).toContainText(username);
  });

  test("should see account balance", async ({ page }) => {
    await login(page);
    await expect(byTestId(page, "sidenav-user-balance")).toBeVisible();
    await expect(byTestId(page, "sidenav-user-balance")).not.toHaveText("");
  });

  test("should see account transactions history", async ({ page }) => {
    await login(page);
    await byTestId(page, "nav-personal-tab").click();
    await expect(page).toHaveURL(/\/personal$/);
    await expect(byTestId(page, "transaction-list")).toBeVisible();
    expect(await page.locator('[data-test^="transaction-item-"]').count()).toBeGreaterThan(0);
  });

  test("should see account transaction details", async ({ page }) => {
    await login(page);
    await byTestId(page, "nav-personal-tab").click();
    await page.locator('[data-test^="transaction-item-"]').first().click();
    await expect(page).toHaveURL(/\/transaction\/[\w-]+$/);
    await expect(byTestId(page, "transaction-detail-header")).toBeVisible();
  });

  test("should update account user settings", async ({ page }) => {
    await login(page);
    await byTestId(page, "sidenav-user-settings").click();
    await byTestId(page, "user-settings-firstName-input").fill("Edward");
    await byTestId(page, "user-settings-submit").click();
    await expect(byTestId(page, "sidenav-user-full-name")).toContainText("Edward J");
  });

  test("should add a new bank account", async ({ page }) => {
    await login(page);
    await byTestId(page, "sidenav-bankaccounts").click();
    await byTestId(page, "bankaccount-new").click();
    await inputByTestId(page, "bankaccount-bankName-input").fill("Student Bank");
    await inputByTestId(page, "bankaccount-routingNumber-input").fill("123456789");
    await inputByTestId(page, "bankaccount-accountNumber-input").fill("123456789");
    await byTestId(page, "bankaccount-submit").click();
    await expect(byTestId(page, "bankaccount-list")).toContainText("Student Bank");
  });

  test("should delete a bank account", async ({ page }) => {
    await login(page);
    await byTestId(page, "sidenav-bankaccounts").click();
    await byTestId(page, "bankaccount-delete").first().click();
    await expect(byTestId(page, "bankaccount-list")).toContainText("(Deleted)");
  });
});

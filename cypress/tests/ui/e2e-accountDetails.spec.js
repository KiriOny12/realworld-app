describe("User Details", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  it("see account transactions history", function () {
    cy.visit("/");
    cy.getBySel("signin-username").type(users.testuser.username);
    cy.getBySel("signin-password").type(users.testuser.password);
    cy.get("[data-test=signin-submit]").click();
    cy.get("[data-test=transaction-list]", { timeout: 10000 }).should("exist").should("be.visible");
  });

  it("see account transactions details", function () {
    cy.get('li.MuiListItem-root[data-test^="transaction-item-"]').first().click();
    cy.url().should("include", "/transaction");
  });

  it("should see account balance", function () {
    cy.get("[data-test=sidenav-user-balance]")
      .invoke("text")
      .then((amountText) => {
        const numericAmount = parseFloat(amountText.replace(/[^0-9.]/g, ""));
        const amountInCents = Math.round(numericAmount * 100);

        expect(amountInCents).to.equal(users.testuser.balance);
      });
  });

  it("should see account details", function () {
    cy.get("[data-test=sidenav-user-settings]").click();
    cy.url().should("include", "/user/settings");
    cy.get("#user-settings-firstName-input").should("have.value", users.testuser.firstName);
    cy.get("#user-settings-lastName-input").should("have.value", users.testuser.lastName);
    cy.get("#user-settings-email-input").should("have.value", users.testuser.email);
    cy.get("#user-settings-phoneNumber-input").should("have.value", users.testuser.phoneNumber);
  });
});

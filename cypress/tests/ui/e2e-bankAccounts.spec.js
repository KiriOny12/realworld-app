describe("User Details", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.getBySel("signin-username").type(users.testuser.username);
    cy.getBySel("signin-password").type(users.testuser.password);
    cy.get("[data-test=signin-submit]").click();
    cy.get("[data-test=sidenav-user-settings]").click();
    cy.url().should("include", "/user/settings");
    cy.get("[data-test=sidenav-bankaccounts]").click();
  });

  it("add new bank account", function () {
    cy.get("[data-test=bankaccount-new]").click();
    cy.get("#bankaccount-bankName-input").clear().type("MonoBank");
    cy.get("#bankaccount-routingNumber-input").clear().type("123456789");
    cy.get("#bankaccount-accountNumber-input").clear().type("123456789");
    cy.get("[data-test=bankaccount-submit]").click();
    cy.get("ul[data-test=bankaccount-list]").should("exist").should("be.visible");
    cy.get('li:contains("avalBank") button[data-test="bankaccount-delete"]')
      .should("exist")
      .should("be.visible");
  });

  it("delete a bank account", function () {
    cy.get('li:contains("MonoBank") button[data-test="bankaccount-delete"]').click();
    cy.get('li:contains("MonoBank (Deleted)")').last().should("exist").should("be.visible");
  });
});

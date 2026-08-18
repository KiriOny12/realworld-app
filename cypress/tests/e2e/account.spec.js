const user = {
  username: "Katharina_Bernier",
  password: "s3cret",
};

const login = () => {
  cy.visit("/signin");
  cy.getBySel("signin-username").type(user.username);
  cy.getBySel("signin-password").type(user.password);
  cy.getBySel("signin-submit").click();
  cy.getBySel("sidenav-username").should("contain", user.username);
};

describe("Account", () => {
  beforeEach(() => cy.task("db:seed"));

  it("should register a new account", () => {
    const username = `student_${Date.now()}`;
    cy.visit("/signup");
    cy.getBySel("signup-first-name").type("Test");
    cy.getBySel("signup-last-name").type("Student");
    cy.getBySel("signup-username").type(username);
    cy.getBySel("signup-password").type("s3cret");
    cy.getBySel("signup-confirmPassword").type("s3cret");
    cy.getBySel("signup-submit").click();
    cy.location("pathname").should("eq", "/signin");
  });

  it("should log in with an existing account", () => {
    login();
    cy.location("pathname").should("eq", "/");
  });

  it("should see account details", () => {
    login();
    cy.getBySel("sidenav-user-full-name").should("contain", "Edgar J");
    cy.getBySel("sidenav-username").should("contain", user.username);
  });

  it("should see account balance", () => {
    login();
    cy.getBySel("sidenav-user-balance").should("be.visible").and("not.be.empty");
  });

  it("should see account transactions history", () => {
    login();
    cy.getBySel("nav-personal-tab").click();
    cy.location("pathname").should("eq", "/personal");
    cy.getBySel("transaction-list").should("be.visible");
    cy.getBySelLike("transaction-item-").should("have.length.greaterThan", 0);
  });

  it("should see account transaction details", () => {
    login();
    cy.getBySel("nav-personal-tab").click();
    cy.getBySelLike("transaction-item-").first().click();
    cy.location("pathname").should("match", /^\/transaction\/[\w-]+$/);
    cy.getBySel("transaction-detail-header").should("be.visible");
  });

  it("should update account user settings", () => {
    login();
    cy.getBySel("sidenav-user-settings").click();
    cy.getBySel("user-settings-firstName-input").clear().type("Edward");
    cy.getBySel("user-settings-submit").click();
    cy.getBySel("sidenav-user-full-name").should("contain", "Edward J");
  });

  it("should add a new bank account", () => {
    login();
    cy.getBySel("sidenav-bankaccounts").click();
    cy.getBySel("bankaccount-new").click();
    cy.getBySel("bankaccount-bankName-input").type("Student Bank");
    cy.getBySel("bankaccount-routingNumber-input").type("123456789");
    cy.getBySel("bankaccount-accountNumber-input").type("123456789");
    cy.getBySel("bankaccount-submit").click();
    cy.getBySel("bankaccount-list").should("contain", "Student Bank");
  });

  it("should delete a bank account", () => {
    login();
    cy.getBySel("sidenav-bankaccounts").click();
    cy.getBySel("bankaccount-delete").first().click();
    cy.getBySel("bankaccount-list").should("contain", "(Deleted)");
  });
});

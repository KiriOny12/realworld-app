const user = {
  username: "Katharina_Bernier",
  password: "s3cret",
};

const login = () => {
  cy.visit("/signin");
  cy.intercept("POST", "**/login").as("loginUser");
  cy.get('input[name="username"]').type(user.username);
  cy.get('input[name="password"]').type(user.password);
  cy.getBySel("signin-submit").click();
  cy.wait("@loginUser").its("response.statusCode").should("eq", 200);
  cy.getBySel("sidenav-username").should("contain", user.username);
};

const interceptGraphql = (operationName, alias) => {
  cy.intercept("POST", "**/graphql", (request) => {
    if (request.body.operationName === operationName) {
      request.alias = alias;
    }
  });
};

describe("Account journeys", () => {
  beforeEach(() => {
    cy.request("POST", `${Cypress.env("apiUrl")}/testData/seed`);
  });

  it("should register a new account", () => {
    const username = `new_user_${Date.now()}`;

    cy.visit("/signup");
    cy.get('input[name="firstName"]').type("New");
    cy.get('input[name="lastName"]').type("User");
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type("s3cret");
    cy.get('input[name="confirmPassword"]').type("s3cret");
    cy.intercept("POST", "**/users").as("registerUser");
    cy.getBySel("signup-submit").click();

    cy.wait("@registerUser").its("response.statusCode").should("eq", 201);
    cy.location("pathname").should("eq", "/signin");
  });

  it("should log in with an existing account", () => {
    login();
    cy.location("pathname").should("eq", "/");
  });

  it("should see account details", () => {
    login();
    cy.getBySel("sidenav-user-full-name").should("contain", "Edgar").and("contain", "J");
    cy.getBySel("sidenav-username").should("contain", user.username);
  });

  it("should see account balance", () => {
    login();
    cy.getBySel("sidenav-user-balance")
      .should("be.visible")
      .invoke("text")
      .should("match", /^\$[\d,]+\.\d{2}$/);
    cy.contains("Account Balance").should("be.visible");
  });

  it("should see account transactions history", () => {
    login();
    cy.getBySel("nav-personal-tab").click();
    cy.location("pathname").should("eq", "/personal");
    cy.getBySel("list-skeleton").should("not.exist");
    cy.getBySel("transaction-list").should("be.visible");
    cy.getBySelLike("transaction-item-").should("have.length.greaterThan", 0);
  });

  it("should see account transaction details", () => {
    login();
    cy.getBySel("nav-personal-tab").click();
    cy.getBySel("list-skeleton").should("not.exist");
    cy.getBySelLike("transaction-item-")
      .first()
      .invoke("attr", "data-test")
      .then((testId) => {
        const transactionId = testId.replace("transaction-item-", "");
        cy.get(`[data-test="${testId}"]`).click();
        cy.location("pathname").should("eq", `/transaction/${transactionId}`);
      });
    cy.getBySel("transaction-detail-header").should("contain", "Transaction Detail");
    cy.getBySel("transaction-description").should("be.visible");
  });

  it("should update account user settings", () => {
    login();
    cy.getBySel("sidenav-user-settings").click();
    cy.location("pathname").should("eq", "/user/settings");
    cy.getBySel("user-settings-firstName-input").clear().type("Updated");
    cy.intercept("PATCH", "**/users/*").as("updateUser");
    cy.getBySel("user-settings-submit").click();

    cy.wait("@updateUser").its("response.statusCode").should("eq", 204);
    cy.getBySel("sidenav-user-full-name").should("contain", "Updated");
  });

  it("should add a new bank account", () => {
    login();
    cy.getBySel("sidenav-bankaccounts").click();
    cy.getBySel("bankaccount-new").click();
    cy.get('input[name="bankName"]').type("Automation Bank");
    cy.get('input[name="routingNumber"]').type("123456789");
    cy.get('input[name="accountNumber"]').type("1234567890");
    interceptGraphql("CreateBankAccount", "createBankAccount");
    cy.getBySel("bankaccount-submit").click();

    cy.wait("@createBankAccount").its("response.statusCode").should("eq", 200);
    cy.location("pathname").should("eq", "/bankaccounts");
    cy.getBySel("bankaccount-list").should("contain", "Automation Bank");
  });

  it("should delete a bank account", () => {
    login();
    cy.getBySel("sidenav-bankaccounts").click();
    cy.getBySel("bankaccount-list").should("be.visible");
    interceptGraphql("DeleteBankAccount", "deleteBankAccount");
    cy.getBySel("bankaccount-delete").first().click();

    cy.wait("@deleteBankAccount").its("response.statusCode").should("eq", 200);
    cy.getBySel("bankaccount-list").should("contain", "(Deleted)");
    cy.getBySel("bankaccount-delete").should("not.exist");
  });
});

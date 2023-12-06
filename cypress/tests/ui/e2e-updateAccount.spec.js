describe("Update User Details", () => {
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
  });

  afterEach(() => {
    cy.get("[data-test=sidenav-signout]").click();
  });

  it("should be possible to change and save changes", function () {
    cy.get("#user-settings-firstName-input").clear().type("Julia");
    cy.get("#user-settings-lastName-input").clear().type("Shai");
    cy.get("#user-settings-email-input").clear().type("test@test.com");
    cy.get("[data-test=user-settings-submit]").click();
  });

  it("changes should be saved", function () {
    cy.get("#user-settings-firstName-input").should("have.value", "Julia");
    cy.get("#user-settings-lastName-input").should("have.value", "Shai");
    cy.get("#user-settings-email-input").should("have.value", "test@test.com");
  });

  it("changing to previous values", function () {
    cy.get("#user-settings-firstName-input").clear().type(users.testuser.firstName);
    cy.get("#user-settings-lastName-input").clear().type(users.testuser.lastName);
    cy.get("#user-settings-email-input").clear().type(users.testuser.email);
    cy.get("[data-test=user-settings-submit]").click();
  });
});

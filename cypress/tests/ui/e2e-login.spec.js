describe("User Login", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("should successfully loged in existing User account", function () {
    cy.login(users.testuser.username, users.testuser.password);
    cy.get("[data-test=sidenav-username]").should("exist").contains(users.testuser.username);
  });

  it("should see log in error on invalid credentials", function () {
    cy.login(users.invaliduser.username, users.invaliduser.password);
    cy.get(".MuiAlert-message").should("exist");
  });
});

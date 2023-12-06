describe("Sign Up Form", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("should display an error message for invalid form submission", () => {
    // Submit the form without filling in any fields
    cy.get("[data-test=signup-submit]").click();
    cy.get("[aria-describedby=firstName-helper-text]").should("exist").should("be.visible");
  });

  it("should successfully submit the form for valid data", () => {
    cy.get("[data-test=signup-first-name] input").type("test");
    cy.get("[data-test=signup-last-name] input").type("test2");
    cy.get("[data-test=signup-username] input").type("test");
    cy.get("[data-test=signup-password] input").type("s3cret");
    cy.get("[data-test=signup-confirmPassword] input").type("s3cret");

    cy.get("[data-test=signup-submit]").click();
    cy.url().should("include", "/signin");
  });
});

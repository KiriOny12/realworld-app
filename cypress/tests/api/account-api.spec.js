const apiUrl = () => Cypress.env("apiUrl");

describe("Account API", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.loginByApi("Katharina_Bernier", "s3cret");
  });

  it("gets a list of bank accounts for the user", () => {
    cy.request(`${apiUrl()}/bankAccounts`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.results).to.be.an("array").and.not.be.empty;
      expect(body.results[0]).to.include.keys("id", "bankName", "accountNumber");
    });
  });

  it("deletes a bank account", () => {
    cy.request(`${apiUrl()}/bankAccounts`).then(({ body }) => {
      const account = body.results.find(({ isDeleted }) => !isDeleted);
      cy.request("DELETE", `${apiUrl()}/bankAccounts/${account.id}`).then((response) => {
        expect(response.status).to.eq(200);
        cy.request(`${apiUrl()}/bankAccounts`).then(({ body: updatedBody }) => {
          expect(updatedBody.results.find(({ id }) => id === account.id).isDeleted).to.eq(true);
        });
      });
    });
  });

  it("gets a user profile by username", () => {
    cy.request(`${apiUrl()}/users/profile/Katharina_Bernier`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.user).to.include({ firstName: "Edgar", lastName: "Johns" });
    });
  });

  it("creates a new comment for a transaction", () => {
    cy.request(`${apiUrl()}/testData/transactions`).then(({ body }) => {
      const transactionId = body.results[0].id;
      cy.request("POST", `${apiUrl()}/comments/${transactionId}`, {
        content: "API test comment",
      })
        .its("status")
        .should("eq", 200);
    });
  });

  it("gets a list of users", () => {
    cy.request(`${apiUrl()}/users`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.results).to.be.an("array").and.not.be.empty;
      expect(body.results.some(({ username }) => username === "Katharina_Bernier")).to.eq(false);
    });
  });
});

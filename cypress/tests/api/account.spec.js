const apiUrl = () => Cypress.env("apiUrl");
const username = "Katharina_Bernier";
const password = "s3cret";

describe("Account API", () => {
  let currentUser;

  beforeEach(() => {
    cy.request("POST", `${apiUrl()}/testData/seed`);
    cy.request("POST", `${apiUrl()}/login`, { username, password }).then(({ body }) => {
      currentUser = body.user;
    });
  });

  it("gets a list of bank accounts for the user", () => {
    cy.request(`${apiUrl()}/bankAccounts`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.results).to.be.an("array").and.not.be.empty;
      expect(body.results.every((account) => account.userId === currentUser.id)).to.eq(true);
    });
  });

  it("deletes a bank account", () => {
    cy.request("POST", `${apiUrl()}/bankAccounts`, {
      bankName: "API Test Bank",
      routingNumber: "123456789",
      accountNumber: "1234567890",
    })
      .its("body.account.id")
      .then((bankAccountId) => {
        cy.request("DELETE", `${apiUrl()}/bankAccounts/${bankAccountId}`)
          .its("status")
          .should("eq", 200);
        cy.request(`${apiUrl()}/bankAccounts/${bankAccountId}`).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.account.id).to.eq(bankAccountId);
          expect(body.account.isDeleted).to.eq(true);
        });
      });
  });

  it("gets a user profile by username", () => {
    cy.request(`${apiUrl()}/users/profile/${username}`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.user).to.include({ firstName: "Edgar", lastName: "Johns" });
      expect(body.user).to.have.all.keys("firstName", "lastName", "avatar");
    });
  });

  it("creates a new comment for a transaction", () => {
    const content = `API comment ${Date.now()}`;

    cy.request(`${apiUrl()}/transactions`)
      .its("body.results.0.id")
      .then((transactionId) => {
        cy.request("POST", `${apiUrl()}/comments/${transactionId}`, { content }).then(
          ({ status }) => {
            expect(status).to.eq(200);
          }
        );
        cy.request(`${apiUrl()}/comments/${transactionId}`).then(({ body }) => {
          expect(
            body.comments.some(
              (comment) =>
                comment.content === content &&
                comment.userId === currentUser.id &&
                comment.transactionId === transactionId
            )
          ).to.eq(true);
        });
      });
  });

  it("gets a list of users", () => {
    cy.request(`${apiUrl()}/users`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.results).to.be.an("array").and.not.be.empty;
      expect(body.results.map((user) => user.id)).not.to.include(currentUser.id);
    });
  });
});

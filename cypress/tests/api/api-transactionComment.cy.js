describe("Add Transaction Comment", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.loginByApi(users.testuser.username, users.testuser.password);
  });

  it("should add a comment for a transaction", () => {
    cy.readFile("data/database.json").then((fileContent) => {
      const transactionId = fileContent.transactions[0].id;
      const commentContent = "This is a test comment";

      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/comments/${transactionId}`,
        body: {
          content: commentContent,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.equal("OK");
      });
    });
  });
});

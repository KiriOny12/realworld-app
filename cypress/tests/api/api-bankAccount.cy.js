describe("BankAccounts", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.loginByApi(users.testuser.username, users.testuser.password);
  });

  it('should get bank accounts list', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env("apiUrl")}/bankaccounts`,
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('results');
    });
  });

  it("should DELETE bank account", () => {
    cy.readFile("data/database.json").then((fileContent) => {
      const bankAccountId = fileContent.bankaccounts[0].id;
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/bankaccounts/${bankAccountId}`,
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });
});

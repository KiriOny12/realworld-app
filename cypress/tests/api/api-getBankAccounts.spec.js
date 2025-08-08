describe('Bank Accounts', () => {
  let users;

  before(() => {
    cy.fixture('users').then(data => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.loginByApi(users.testuser.username, users.testuser.password);
  });

  it('should get bank accounts for authenticated user', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env("apiUrl")}/bankAccounts`,
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('results');
    });
  });

});
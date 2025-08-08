describe('Users', () => {
  let users;

  before(() => {
    cy.fixture('users').then(data => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.loginByApi(users.testuser.username, users.testuser.password);
  });

  it('should get list of users', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env("apiUrl")}/users`,
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('results');
    });
  });
});
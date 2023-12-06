describe("UserAccaunt", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.loginByApi(users.testuser.username, users.testuser.password);
  });

  it('should get profile by username', () => {

    const username = users.testuser.username

    cy.request({
      method: 'GET',
      url: `${Cypress.env("apiUrl")}/users/profile/${username}`,
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('object'); 
      expect(response.body).to.have.property('user');
    });
  });

  
});

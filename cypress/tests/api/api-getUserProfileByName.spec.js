describe('User Profile', () => {
  let users;

  before(() => {
    cy.fixture('users').then(data => {
      users = data;
    });
  });

  it('should get user profile by username', () => {
    const targetUsername = users.testuser.username;

    cy.request({
      method: 'GET',
      url: `${Cypress.env("apiUrl")}/users/profile/${targetUsername}`,
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('user');

      expect(response.body.user).to.have.property('firstName');
      expect(response.body.user).to.have.property('lastName');
    });
  });


});
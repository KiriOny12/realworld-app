describe('Login with existing account spec', () => {
  const existingUser = {
    username: 'Katharina_Bernier',
    password: 's3cret'
  };

  beforeEach(() => {
    cy.visit('/signin');
  });

  it('should log in with existing account', function () {
    cy.get('[data-test=signin-username]').clear().type(existingUser.username);
    cy.get('[data-test=signin-password]').clear().type(existingUser.password);

    cy.get('[data-test=signin-submit]').click();

    cy.url().should('not.include', '/signin');
    cy.get('[data-test=sidenav-username]').should('exist').contains(existingUser.username);
  });

  it('should show error with incorrect password', function () {
    cy.get('[data-test=signin-username]').clear().type(existingUser.username);
    cy.get('[data-test=signin-password]').clear().type('wrongpassword');

    cy.get('[data-test=signin-submit]').click();

    cy.get('.MuiAlert-message').should('exist');
    cy.url().should('include', '/signin');
  });
});
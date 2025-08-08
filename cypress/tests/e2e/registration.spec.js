describe('Registration spec', () => {
  let users;
  const newUser = {
    firstName: 'Test',
    lastName: 'User',
    username: `testuser${Date.now()}`, // Unique username using timestamp
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
  };

  before(() => {
    cy.fixture('users').then(data => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.visit('/signup');
  });

  it('should register a new account', function () {
    // Fill in the registration form
    cy.get('[data-test=signup-first-name]').type(newUser.firstName);
    cy.get('[data-test=signup-last-name]').type(newUser.lastName);
    cy.get('[data-test=signup-username]').type(newUser.username);
    cy.get('[data-test=signup-password]').type(newUser.password);
    cy.get('[data-test=signup-confirmPassword]').type(newUser.confirmPassword);

    cy.get('[data-test=signup-submit]').click();

    cy.url().should('not.include', '/signup');

    //Try to log in with the new account
    cy.visit('/signin');
    cy.login(newUser.username, newUser.password);
    cy.get('[data-test=sidenav-username]').should('exist').contains(newUser.username);
  });

  it('should show error when passwords do not match', function () {
    cy.get('[data-test=signup-first-name]').type(newUser.firstName);
    cy.get('[data-test=signup-last-name]').type(newUser.lastName);
    cy.get('[data-test=signup-username]').type(`${newUser.username}_mismatch`);
    cy.get('[data-test=signup-password]').type(newUser.password);
    cy.get('[data-test=signup-confirmPassword]').type('DifferentPassword123!');

    cy.get('[data-test=signup-submit]').should('be.disabled');
  });
});
const BASE_URL = 'http://localhost:3000';

describe('Authentication', () => {
  let user;
  before(() => {
    cy.fixture('users').then((users) => {
      user = users.testuser;
    });
  });

  it('Should register a new account', () => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;

    cy.visit(`${BASE_URL}/signup`);

    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type('s3cret');
    cy.get('input[name="confirmPassword"]').type('s3cret');
    cy.get('[data-test="signup-submit"]').click();

    cy.url().should('match', /.*signin/);

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type('s3cret');
    cy.get('[data-test="signin-submit"]').click();

    cy.url().should('match', /.*\/$/);
    cy.get('[data-test="user-onboarding-dialog"]').should('be.visible');
    cy.get('[data-test="user-onboarding-dialog-title"]').should('contain.text', 'Get Started with Real World App');
  });

  it('Should log in with existing account', () => {
    cy.visit(`${BASE_URL}/signin`);

    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('[data-test="signin-submit"]').click();

    cy.url().should('match', /.*\/$/);
    cy.get('[data-test="sidenav-username"]').should('be.visible')
      .and('contain.text', user.username);
  });
});

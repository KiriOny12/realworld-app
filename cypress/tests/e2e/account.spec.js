const BASE_URL = 'http://localhost:3000';

describe('Account Details', () => {
  let user;
  before(() => {
    cy.fixture('users').then((users) => {
      user = users.testuser;
    });
  });

  beforeEach(() => {
    cy.visit(`${BASE_URL}/signin`);
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('[data-test="signin-submit"]').click();
    cy.url().should('match', /.*\/$/);
  });

  it('Should see account balance', () => {
    cy.get('[data-test="sidenav-user-balance"]')
      .should('be.visible')
      .then(($el) => {
        const balanceText = $el.text();
        expect(balanceText).to.contain('$');
        expect(balanceText).to.match(/\$[\d,]+\.\d{2}/);
      });
  });

  it('Should see account details', () => {
    cy.get('[data-test="sidenav-user-settings"]').click();
    cy.get('[data-test="user-settings-firstName-input"]').should('be.visible');
    cy.get('[data-test="user-settings-lastName-input"]').should('be.visible');
    cy.get('[data-test="user-settings-email-input"]').should('be.visible');
    cy.get('[data-test="user-settings-phoneNumber-input"]').should('be.visible');
  });

  it('Should see account transactions history', () => {
    cy.get('[data-test="transaction-list"]').should('be.visible');
    cy.get('[data-test^="transaction-item"]').its('length').should('be.gt', 0);
  });

  it('Should see account transaction details', () => {
    cy.get('[data-test^="transaction-item"]').first().click();
    cy.get('[data-test="transaction-detail-header"]').should('be.visible');
    cy.get('[data-test^="transaction-amount-"]').should('be.visible');
  });

  it('Should update account user settings', () => {
    cy.get('[data-test="sidenav-user-settings"]').click();
    cy.get('[data-test="user-settings-firstName-input"]').clear().type('UpdatedFirstName');
    cy.get('[data-test="user-settings-lastName-input"]').clear().type('UpdatedLastName');
    cy.get('[data-test="user-settings-submit"]').click();
    cy.get('[data-test="user-settings-firstName-input"]').should('have.value', 'UpdatedFirstName');
    cy.get('[data-test="user-settings-lastName-input"]').should('have.value', 'UpdatedLastName');
    cy.get('[data-test="sidenav-user-full-name"]').should('contain.text', 'UpdatedFirstName');
  });
});

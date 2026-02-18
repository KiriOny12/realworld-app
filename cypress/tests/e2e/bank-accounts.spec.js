const BASE_URL = 'http://localhost:3000';

describe('Bank Accounts', () => {
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

  it('Should add new bank account', () => {
    cy.get('[data-test="sidenav-bankaccounts"]').click();
    cy.get('[data-test="bankaccount-new"]').click();

    const timestamp = Date.now();
    const bankName = `Bank${timestamp}`;

    cy.get('[data-test="bankaccount-bankName-input"] input').type(bankName);
    cy.get('[data-test="bankaccount-routingNumber-input"] input').type('123456789');
    cy.get('[data-test="bankaccount-accountNumber-input"] input').type('987654321');
    cy.get('[data-test="bankaccount-submit"]').click();

    cy.contains(bankName).should('be.visible');
  });

  it('Should delete bank account', () => {
    cy.get('[data-test="sidenav-bankaccounts"]').click();

    cy.get('[data-test^="bankaccount-list-item"]').then(($items) => {
      const items = $items.filter((i, el) => {
        return Cypress.$(el).find('[data-test="bankaccount-delete"]').length > 0;
      });

      if (items.length === 0) return;

      cy.wrap(items[0]).find('[data-test="bankaccount-delete"]').click();
      cy.wrap(items[0]).should('contain.text', 'Deleted');
      cy.wrap(items[0]).find('[data-test="bankaccount-delete"]').should('not.exist');
    });
  });
});

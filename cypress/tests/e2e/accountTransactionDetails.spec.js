describe('Account details spec', () => {
  const existingUser = {
    username: 'Katharina_Bernier',
    password: 's3cret',
    firstName: 'Edgar',
    lastName: 'Johns',
    email: 'Norene39@yahoo.com',
    phoneNumber: '625-316-9882'
  };

  const TRANSACTION_ID = '183VHWyuQMS';

  beforeEach(() => {
    cy.visit('/signin');
    cy.get('[data-test=signin-username]').clear().type(existingUser.username);
    cy.get('[data-test=signin-password]').clear().type(existingUser.password);
    cy.get('[data-test=signin-submit]').click();

    // Wait for successful login
    cy.url().should('not.include', '/signin');
  });

  it('should see transaction details page', () => {
    cy.get(`[data-test="transaction-item-${TRANSACTION_ID}"]`).click();
    cy.url().should('contain', `/transaction/${TRANSACTION_ID}`);

    cy.get('[data-test="transaction-detail-header"]')
      .should('be.visible')
      .and('contain.text', 'Transaction Detail');

    cy.get(`[data-test="transaction-sender-${TRANSACTION_ID}"]`)
      .should('be.visible')
      .and('contain.text', 'Kaylin Homenick');

    cy.get(`[data-test="transaction-action-${TRANSACTION_ID}"]`)
      .should('be.visible')
      .and('contain.text', 'paid');

    cy.get(`[data-test="transaction-receiver-${TRANSACTION_ID}"]`)
      .should('be.visible')
      .and('contain.text', 'Arely Kertzmann');

    cy.get(`[data-test="transaction-amount-${TRANSACTION_ID}"]`)
      .should('be.visible')
      .and('contain.text', '-$80.31');

    cy.get('[data-test="transaction-description"]')
      .should('be.visible')
      .and('contain.text', 'Payment: bDjUb4ir5O to qywYp6hS0U');

    cy.get('[data-test="transaction-sender-avatar"]').should('be.visible');
    cy.get('[data-test="transaction-receiver-avatar"]').should('be.visible');
  });
});
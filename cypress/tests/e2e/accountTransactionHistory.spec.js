describe('Account transaction history spec', () => {
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
    // Login before each test
    cy.visit('/signin');
    cy.get('[data-test=signin-username] input').type(existingUser.username);
    cy.get('[data-test=signin-password] input').type(existingUser.password);
    cy.get('[data-test=signin-submit]').click();

    cy.url().should('not.include', '/signin');
  });

  it('should see account transaction history', () => {
    // Get all transaction items
    const transactionItems = '[data-test^="transaction-item-"]';

    // Assert that at least one transaction is visible
    cy.get(transactionItems).first().should('be.visible');

    // Get the specific transaction
    const specificTransaction = `[data-test="transaction-item-${TRANSACTION_ID}"]`;

    // Get transaction elements
    const amountElement = `${specificTransaction} [data-test="transaction-amount-${TRANSACTION_ID}"]`;
    const senderElement = `${specificTransaction} [data-test="transaction-sender-${TRANSACTION_ID}"]`;
    const actionElement = `${specificTransaction} [data-test="transaction-action-${TRANSACTION_ID}"]`;
    const receiverElement = `${specificTransaction} [data-test="transaction-receiver-${TRANSACTION_ID}"]`;

    // Assert that the transaction amount is present and visible
    cy.get(amountElement).should('be.visible');
    cy.get(amountElement).should('contain.text', '$');

    cy.get(senderElement).should('be.visible');
    cy.get(senderElement).should('not.be.empty');

    cy.get(actionElement).should('be.visible');
    cy.get(actionElement).should('not.be.empty');

    cy.get(receiverElement).should('be.visible');
    cy.get(receiverElement).should('not.be.empty');
  });
});
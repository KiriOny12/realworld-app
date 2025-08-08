describe('Account details spec', () => {
  const existingUser = {
    username: 'Katharina_Bernier',
    password: 's3cret',
    firstName: 'Edgar',
    lastName: 'Johns',
    email: 'Norene39@yahoo.com',
    phoneNumber: '625-316-9882'
  };

  const accountName = `dummy_account_${Date.now()}`;
  const routingNumber = '123-12345';
  const accountNumber = '1234567890';

  beforeEach(() => {
    cy.visit('/signin');
    cy.get('[data-test=signin-username]').clear().type(existingUser.username);
    cy.get('[data-test=signin-password]').clear().type(existingUser.password);
    cy.get('[data-test=signin-submit]').click();

    cy.url().should('not.include', '/signin');
  });
  it('should create a new bank account', () => {
    cy.get('[data-test="sidenav-bankaccounts"]').click();
    cy.url().should('contain', '/bankaccounts');
    cy.get('[data-test="bankaccount-new"]').click();

    cy.get('[data-test="bankaccount-bankName-input"]')
      .find('input')
      .type(accountName);

    cy.get('[data-test="bankaccount-routingNumber-input"]')
      .find('input')
      .type(routingNumber);

    cy.get('[data-test="bankaccount-accountNumber-input"]')
      .find('input')
      .type(accountNumber);

    cy.get('[data-test="bankaccount-submit"]').click();

    cy.get('[data-test="bankaccount-list"]').should('be.visible');

    cy.get('[data-test="bankaccount-list"]')
      .find('li')
      .should('contain.text', accountName);

    cy.get('[data-test="bankaccount-list"]')
      .find('li')
      .contains(accountName)
      .should('be.visible');
  });

  it('should delete the bank account', () => {
    // Visit the bank accounts page
    cy.get('[data-test="sidenav-bankaccounts"]').click();

    // Find the list item that contains our account name and click its delete button
    cy.get('[data-test="bankaccount-list"]')
      .find('li')
      .contains(accountName)
      .parent()
      .parent()
      .find('[data-test="bankaccount-delete"]')
      .click();

    cy.get('[data-test="bankaccount-list"]')
      .find('li')
      .contains(accountName)
      .should('contain.text', '(Deleted)');

    cy.get('[data-test="bankaccount-list"]')
      .find('li')
      .contains(accountName)
      .parent()
      .parent()
      .find('[data-test="bankaccount-delete"]')
      .should('not.exist');
  });
});
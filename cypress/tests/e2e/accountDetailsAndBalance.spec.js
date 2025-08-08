describe('Account details spec', () => {
  const existingUser = {
    username: 'Katharina_Bernier',
    password: 's3cret',
    firstName: 'Edgar',
    lastName: 'Johns',
    email: 'Norene39@yahoo.com',
    phoneNumber: '625-316-9882'
  };

  beforeEach(() => {
    cy.visit('/signin');
    cy.get('[data-test=signin-username]').clear().type(existingUser.username);
    cy.get('[data-test=signin-password]').clear().type(existingUser.password);
    cy.get('[data-test=signin-submit]').click();

    cy.url().should('not.include', '/signin');
  });

  it('should see account details', function () {
    cy.get('[data-test=sidenav-user-settings]').click();
    cy.url().should('include', '/user/settings');
    cy.get('h2').should('contain', 'User Settings');

    // Verify all user details are displayed correctly
    cy.get('[data-test=user-settings-firstName-input]')
      .should('be.visible')
      .should('have.value', existingUser.firstName);

    cy.get('[data-test=user-settings-lastName-input]')
      .should('be.visible')
      .should('have.value', existingUser.lastName);

    cy.get('[data-test=user-settings-email-input]')
      .should('be.visible')
      .should('have.value', existingUser.email);

    cy.get('[data-test=user-settings-phoneNumber-input]')
      .should('be.visible')
      .should('have.value', existingUser.phoneNumber);

    cy.get('[data-test=user-settings-submit]')
      .should('be.visible')
      .should('contain', 'Save');
  });

  it('should see account balance', function () {
    cy.get('[data-test=sidenav-user-balance]')
      .should('be.visible')
      .should('contain', '$1,681.37');

    cy.get('[data-test=sidenav-user-balance]')
      .parent()
      .within(() => {
        cy.get('h6').last()
          .should('contain', 'Account Balance');
      });
  });
});
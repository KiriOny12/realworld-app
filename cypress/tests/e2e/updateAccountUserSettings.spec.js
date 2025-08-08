describe('Update User Settings spec', () => {
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

  afterEach(() => {
    // Restore original user data after each test
    cy.get('[data-test="sidenav-user-settings"]').click();
    cy.url().should('include', '/user/settings');

    cy.get('[data-test="user-settings-firstName-input"]')
      .clear()
      .type(existingUser.firstName);

    cy.get('[data-test="user-settings-lastName-input"]')
      .clear()
      .type(existingUser.lastName);

    cy.get('[data-test="user-settings-email-input"]')
      .clear()
      .type(existingUser.email);

    cy.get('[data-test="user-settings-phoneNumber-input"]')
      .clear()
      .type(existingUser.phoneNumber);

    // Save the original values
    cy.get('[data-test="user-settings-submit"]').click();

    // Verify the original full name is restored
    const expectedOriginalFullName = `${existingUser.firstName} ${existingUser.lastName.charAt(0)}`;
    cy.get('[data-test="sidenav-user-full-name"]').should('contain.text', expectedOriginalFullName);
  });

  it('should update user settings and reflect changes in full name', () => {
    // Generate random test data
    const newUserData = {
      firstName: `TestFirst${Math.floor(Math.random() * 1000)}`,
      lastName: `TestLast${Math.floor(Math.random() * 1000)}`,
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      phoneNumber: `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    };

    // Click on user settings in sidenav
    cy.get('[data-test="sidenav-user-settings"]').click();

    // Assert that user settings page is opened
    cy.url().should('include', '/user/settings');

    // Assert that the page has H2 with "User Settings"
    cy.get('h2').should('contain.text', 'User Settings');

    cy.get('[data-test="user-settings-firstName-input"]')
      .clear()
      .type(newUserData.firstName);

    cy.get('[data-test="user-settings-lastName-input"]')
      .clear()
      .type(newUserData.lastName);

    cy.get('[data-test="user-settings-email-input"]')
      .clear()
      .type(newUserData.email);

    cy.get('[data-test="user-settings-phoneNumber-input"]')
      .clear()
      .type(newUserData.phoneNumber);

    cy.get('[data-test="user-settings-submit"]').click();

    // Assert that the full name was updated in the sidenav
    const expectedFullName = `${newUserData.firstName} ${newUserData.lastName.charAt(0)}`;
    cy.get('[data-test="sidenav-user-full-name"]').should('contain.text', expectedFullName);
  });
});
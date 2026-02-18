describe('Bank Accounts API', () => {
  const API_BASE_URL = 'http://localhost:3002';
  let cookies;

  before(() => {
    cy.fixture('users').then((users) => {
      const { username, password } = users.testuser;

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/login`,
        body: { username, password },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cookies = response.headers['set-cookie'];
        expect(cookies).to.exist;
      });
    });
  });

  it('Gets a list of bank accounts for user (GET /bankAccounts)', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/bankAccounts`,
      headers: { Cookie: cookies },
    }).then((response) => {
      expect(response.status).to.eq(200);

      const data = response.body;
      expect(data).to.have.property('results');
      expect(data.results).to.be.an('array');

      if (data.results.length > 0) {
        const firstAccount = data.results[0];
        expect(firstAccount).to.have.property('id');
        expect(firstAccount).to.have.property('bankName');
        expect(firstAccount).to.have.property('accountNumber');
        expect(firstAccount).to.have.property('routingNumber');
      }

      cy.log(`Found ${data.results.length} bank accounts`);
    });
  });

  it('Deletes a bank account (DELETE /:bankAccountId)', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE_URL}/bankAccounts`,
      headers: { Cookie: cookies },
      body: {
        bankName: 'MBANK',
        accountNumber: '000000000',
        routingNumber: '444555666',
      },
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(200);

      const bankAccountId = createResponse.body.account.id;
      expect(bankAccountId).to.exist;

      cy.log(`Created bank account with ID: ${bankAccountId}`);

      return cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/bankAccounts/${bankAccountId}`,
        headers: { Cookie: cookies },
      });
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);

      return cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/bankAccounts`,
        headers: { Cookie: cookies },
      });
    }).then((listResponse) => {
      const accounts = listResponse.body.results;
      const deletedAccount = accounts.find(acc => acc.id === accounts.id);

      if (deletedAccount) {
        expect(deletedAccount.isDeleted).to.eq(true);
        cy.log('Bank account soft-deleted (marked as deleted)');
      } else {
        cy.log('Bank account completely removed from list');
      }
    });
  });
});

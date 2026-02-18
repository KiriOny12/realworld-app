describe('Comments API', () => {
  const API_BASE_URL = 'http://localhost:3002';

  let cookies;
  let transactionId;

  before(() => {
    cy.fixture('users').then((users) => {
      const { username, password } = users.testuser;

      cy.request('POST', `${API_BASE_URL}/login`, {
        username,
        password,
      })
      .then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);

        cookies = loginResponse.headers['set-cookie'];
        expect(cookies).to.exist;

        cy.log('Fetching transactions');

        return cy.request({
          method: 'GET',
          url: `${API_BASE_URL}/transactions`,
          headers: {
            Cookie: cookies,
          },
        });
      })
      .then((transactionsResponse) => {
        expect(transactionsResponse.status).to.eq(200);
        expect(transactionsResponse.body).to.have.property('results');
        expect(transactionsResponse.body.results.length).to.be.greaterThan(0);

        transactionId = transactionsResponse.body.results[0].id;
        cy.log(`Using transaction ID: ${transactionId}`);
      });
    });
  });

  it('Creates a comment and verifies it exists (POST + GET /comments/:transactionId)', () => {
    const commentContent = `API Test Comment - ${Date.now()}`;

    cy.log(`Creating comment: "${commentContent}"`);

    cy.request({
      method: 'POST',
      url: `${API_BASE_URL}/comments/${transactionId}`,
      headers: {
        Cookie: cookies,
      },
      body: {
        content: commentContent,
      },
    })
    .then((postResponse) => {
      expect(postResponse.status).to.eq(200);
      expect(postResponse.body).to.eq('OK');

      cy.log('Verifying comment via GET');

      return cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/comments/${transactionId}`,
        headers: {
          Cookie: cookies,
        },
      });
    })
    .then((getResponse) => {
      expect(getResponse.status).to.eq(200);
      expect(getResponse.body).to.have.property('comments');
      expect(getResponse.body.comments).to.be.an('array');

      const createdComment = getResponse.body.comments.find(
        (c) => c.content === commentContent
      );

      expect(createdComment).to.exist;
      expect(createdComment.transactionId).to.eq(transactionId);
      expect(createdComment.id).to.be.a('string');

      cy.log(`Comment verified with ID: ${createdComment.id}`);
    });
  });
});

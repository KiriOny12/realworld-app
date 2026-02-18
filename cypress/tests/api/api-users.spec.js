const API_BASE_URL = 'http://localhost:3002';

describe('Users API', () => {
  let cookies;

  before(() => {
    cy.fixture('users').then((users) => {
      const { username, password } = users.testuser;

      cy.request('POST', `${API_BASE_URL}/login`, {
        username,
        password,
      })
      .then((response) => {
        expect(response.status).to.eq(200);

        cookies = response.headers['set-cookie'];
        expect(cookies).to.exist;

        cy.log('Login successful');
      });
    });
  });

  it('Get a user profile by username (GET /users/profile/:username)', () => {
    const username = 'Tavares_Barrows';

    cy.log(`Fetching profile for user: ${username}...`);

    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/users/profile/${username}`,
      headers: {
        Cookie: cookies,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);

      const data = response.body;
      expect(data).to.have.property('user');

      const user = data.user;
      expect(user).to.have.property('firstName');
      expect(user).to.have.property('lastName');

      cy.log(
        `Retrieved profile: ${user.firstName} ${user.lastName} (@${user.username})`
      );
    });
  });

  it('Gets list of users (GET /users)', () => {
    cy.log('Fetching users list...');

    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/users`,
      headers: {
        Cookie: cookies,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);

      const data = response.body;
      expect(data).to.have.property('results');
      expect(data.results).to.be.an('array');
      expect(data.results.length).to.be.greaterThan(0);

      cy.log(`Found ${data.results.length} user(s)`);

      const firstUser = data.results[0];
      expect(firstUser).to.have.property('id');
      expect(firstUser).to.have.property('username');
      expect(firstUser).to.have.property('firstName');
      expect(firstUser).to.have.property('lastName');

      expect(firstUser.id).to.be.a('string');
      expect(firstUser.username).to.be.a('string');

      cy.log(
        `First user: ${firstUser.firstName} ${firstUser.lastName} (@${firstUser.username})`
      );

      const user = data.results.find(
        (u) => u.username === 'Tavares_Barrows'
      );

      expect(user).to.exist;
      cy.log('User Tavares_Barrows found in list');
    });
  });
});

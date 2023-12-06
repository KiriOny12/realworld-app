describe("Get Users API Test", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.loginByApi(users.testuser.username, users.testuser.password);
  });

  it("should get the list of users using GET request", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/users`,
    }).then((response) => {
      console.log("API Response:", response);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("results");
    });
  });
});

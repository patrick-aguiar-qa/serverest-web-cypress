const apiUrl = () => Cypress.env('apiUrl');
const created = { users: [], products: [] };

function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

Cypress.Commands.add('uniqueEmail', () => cy.wrap(`qa.${uniqueSuffix()}@qa.com`, { log: false }));

Cypress.Commands.add('uniqueProductName', () => cy.wrap(`QA Product ${uniqueSuffix()}`, { log: false }));

Cypress.Commands.add('apiCreateUser', ({ admin = false } = {}) => {
  cy.fixture('users').then((users) => {
    cy.uniqueEmail().then((email) => {
      const user = {
        nome: admin ? users.adminName : users.customerName,
        email,
        password: users.password,
        administrador: String(admin),
      };

      cy.request('POST', `${apiUrl()}/usuarios`, user).then((response) => {
        created.users.push(response.body._id);
        return { ...user, _id: response.body._id };
      });
    });
  });
});

Cypress.Commands.add('apiLogin', (email, password) => {
  cy.request('POST', `${apiUrl()}/login`, { email, password }).its('body.authorization');
});

Cypress.Commands.add('apiCreateProduct', (admin, overrides = {}) => {
  cy.fixture('product').then((fixture) => {
    cy.uniqueProductName().then((nome) => {
      const product = { ...fixture, nome, ...overrides };

      cy.apiLogin(admin.email, admin.password).then((token) => {
        cy.request({
          method: 'POST',
          url: `${apiUrl()}/produtos`,
          headers: { Authorization: token },
          body: product,
        }).then((response) => {
          created.products.push({ id: response.body._id, admin });
          return { ...product, _id: response.body._id };
        });
      });
    });
  });
});

Cypress.Commands.add('trackProductByName', (nome, admin) => {
  cy.request(`${apiUrl()}/produtos?nome=${encodeURIComponent(nome)}`).then((response) => {
    response.body.produtos.forEach(({ _id }) => created.products.push({ id: _id, admin }));
  });
});

Cypress.Commands.add('trackUserByEmail', (email) => {
  cy.request(`${apiUrl()}/usuarios?email=${encodeURIComponent(email)}`).then((response) => {
    response.body.usuarios.forEach(({ _id }) => created.users.push(_id));
  });
});

Cypress.Commands.add('apiCleanup', () => {
  created.products.splice(0).forEach(({ id, admin }) => {
    cy.request({ method: 'POST', url: `${apiUrl()}/login`, body: { email: admin.email, password: admin.password }, failOnStatusCode: false }).then(
      (login) => {
        cy.request({
          method: 'DELETE',
          url: `${apiUrl()}/produtos/${id}`,
          headers: { Authorization: login.body.authorization },
          failOnStatusCode: false,
        });
      },
    );
  });

  created.users.splice(0).forEach((id) => {
    cy.request({ method: 'DELETE', url: `${apiUrl()}/usuarios/${id}`, failOnStatusCode: false });
  });
});

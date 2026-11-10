Cypress.Commands.add('loginViaUi', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid="email"]').click().type(email);
  cy.get('[data-testid="senha"]').click().type(password, { log: false });
  cy.contains('button', 'Entrar').click();
});

// Faster login for tests whose goal is not the login itself:
// gets the token from the API and stores it the same way the front-end does
Cypress.Commands.add('loginViaApi', (user) => {
  cy.apiLogin(user.email, user.password).then((token) => {
    cy.visit('/login');
    cy.window().then((win) => {
      win.localStorage.setItem('serverest/userToken', token);
      win.localStorage.setItem('serverest/userEmail', user.email);
      win.localStorage.setItem('serverest/userNome', user.nome);
    });
  });
});

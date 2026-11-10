describe('Login', () => {
  let admin;
  let customer;

  before(() => {
    cy.apiCreateUser({ admin: true }).then((user) => (admin = user));
    cy.apiCreateUser({ admin: false }).then((user) => (customer = user));
  });

  it('should open the admin home when an admin logs in with valid credentials', () => {
    cy.loginViaUi(admin.email, admin.password);

    cy.location('pathname').should('equal', '/admin/home');
    cy.contains('h1', 'Bem Vindo').should('contain.text', admin.nome);
  });

  it('should open the store home when a customer logs in with valid credentials', () => {
    cy.loginViaUi(customer.email, customer.password);

    cy.location('pathname').should('equal', '/home');
    cy.contains('h1', 'Serverest Store').should('be.visible');
  });

  it('should show an error and stay on the login page when the password is wrong', () => {
    cy.fixture('users').then(({ invalidPassword }) => {
      cy.loginViaUi(customer.email, invalidPassword);
    });

    cy.checkErrorAlert('Email e/ou senha inválidos');
    cy.location('pathname').should('equal', '/login');
  });

  it('should show one error per required field when the form is submitted empty', () => {
    cy.visit('/login');
    cy.contains('button', 'Entrar').click();

    cy.checkErrorAlert('Email é obrigatório');
    cy.checkErrorAlert('Password é obrigatório');
  });

  it('should not submit the form when the email has no "@"', () => {
    cy.intercept('POST', '**/login').as('login');

    cy.loginViaUi('invalid-email', 'any-password');

    cy.get('[data-testid="email"]').then(($input) => {
      expect($input[0].validity.valid).to.equal(false);
    });
    cy.location('pathname').should('equal', '/login');
    cy.get('@login.all').should('have.length', 0);
  });

  it('should open the sign-up page from the "Cadastre-se" link', () => {
    cy.visit('/login');
    cy.get('[data-testid="cadastrar"]').click();

    cy.location('pathname').should('equal', '/cadastrarusuarios');
    cy.contains('h2', 'Cadastro').should('be.visible');
  });
});

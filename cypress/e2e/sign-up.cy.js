describe('Sign-up', () => {
  beforeEach(() => {
    cy.visit('/cadastrarusuarios');
  });

  function fillSignUpForm({ nome, email, password }) {
    cy.get('[data-testid="nome"]').click().type(nome);
    cy.get('[data-testid="email"]').click().type(email);
    cy.get('[data-testid="password"]').click().type(password, { log: false });
  }

  it('should create a customer account and open the store home', () => {
    cy.fixture('users').then(({ customerName, password }) => {
      cy.uniqueEmail().then((email) => {
        fillSignUpForm({ nome: customerName, email, password });
        cy.contains('button', 'Cadastrar').click();

        cy.contains('.alert', 'Cadastro realizado com sucesso').should('be.visible');
        cy.location('pathname', { timeout: 15000 }).should('equal', '/home');
        cy.trackUserByEmail(email);
      });
    });
  });

  it('should create an admin account when the admin checkbox is checked', () => {
    cy.fixture('users').then(({ adminName, password }) => {
      cy.uniqueEmail().then((email) => {
        fillSignUpForm({ nome: adminName, email, password });
        cy.get('[data-testid="checkbox"]').check();
        cy.contains('button', 'Cadastrar').click();

        cy.location('pathname', { timeout: 15000 }).should('equal', '/admin/home');
        cy.contains('h1', 'Bem Vindo').should('contain.text', adminName);
        cy.trackUserByEmail(email);
      });
    });
  });

  it('should show an error when the email is already registered', () => {
    cy.apiCreateUser().then((existing) => {
      fillSignUpForm({ nome: 'Another Name', email: existing.email, password: existing.password });
      cy.contains('button', 'Cadastrar').click();

      cy.checkErrorAlert('Este email já está sendo usado');
      cy.location('pathname').should('equal', '/cadastrarusuarios');
    });
  });

  it('should show one error per required field when the form is submitted empty', () => {
    cy.contains('button', 'Cadastrar').click();

    cy.checkErrorAlert('Nome é obrigatório');
    cy.checkErrorAlert('Email é obrigatório');
    cy.checkErrorAlert('Password é obrigatório');
  });

  it('should go back to the login page from the "Entrar" link', () => {
    cy.get('[data-testid="entrar"]').click();

    cy.location('pathname').should('equal', '/login');
  });
});

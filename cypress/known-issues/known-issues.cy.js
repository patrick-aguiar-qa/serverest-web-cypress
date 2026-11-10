// These tests assert the CORRECT behavior and are expected to FAIL until the bugs are fixed.
// They are kept out of the regression suite (npm test) and documented in BUG_REPORTS.md.
describe('Known issues', () => {
  let admin;
  let customer;
  let product;

  before(() => {
    cy.apiCreateUser({ admin: true }).then((user) => (admin = user));
    cy.apiCreateUser({ admin: false }).then((user) => (customer = user));
    cy.then(() => cy.apiCreateProduct(admin, { quantidade: 2 })).then((p) => (product = p));
  });

  it('BUG-01: a customer should not be able to open the admin area', () => {
    cy.loginViaUi(customer.email, customer.password);
    cy.location('pathname').should('equal', '/home');

    cy.visit('/admin/cadastrarusuarios');

    cy.location('pathname').should('not.match', /^\/admin/);
  });

  it('BUG-02: "-" should remove the product from the shopping list when its quantity is 1', () => {
    cy.loginViaApi(customer);
    cy.visit('/home');
    cy.addProductToShoppingList(product.nome);

    cy.get('[data-testid="product-decrease-quantity"]').click();

    cy.get('[data-testid="shopping-cart-empty-message"]').should('have.text', 'Seu carrinho está vazio');
  });

  it('BUG-03: the shopping list should not accept more units than the product stock', () => {
    cy.loginViaApi(customer);
    cy.visit('/home');
    cy.addProductToShoppingList(product.nome);

    // stock = 2: the 3rd unit must be refused
    cy.get('[data-testid="product-increase-quantity"]').click().click();

    cy.get('[data-testid="shopping-cart-product-quantity"]').should('have.text', 'Total: 2');
  });

  it('BUG-04: "Editar" on the product list should open the product for editing', () => {
    cy.loginViaApi(admin);
    cy.visit('/admin/listarprodutos');

    cy.contains('tr', product.nome).contains('button', 'Editar').click();

    cy.location('pathname').should('not.equal', '/admin/listarprodutos');
  });

  it('BUG-05: the stock field placeholder should be spelled correctly', () => {
    cy.loginViaApi(admin);
    cy.visit('/admin/cadastrarprodutos');

    cy.get('[data-testid="quantity"]').should('have.attr', 'placeholder', 'Digite a quantidade do produto');
  });

  it('BUG-06: the admin user list should not display user passwords', () => {
    cy.loginViaApi(admin);
    cy.visit('/admin/listarusuarios');

    cy.contains('th', 'Senha').should('not.exist');
  });
});

describe('Known issues - mobile and accessibility', () => {
  it('BUG-07: the menu toggle should open the navigation on mobile', () => {
    cy.apiCreateUser().then((customer) => {
      cy.viewport('iphone-x');
      cy.loginViaApi(customer);
      cy.visit('/home');

      cy.get('.navbar-toggler').click();

      cy.get('[data-testid="logout"]').should('be.visible');
    });
  });

  it('BUG-08: the login page should have no critical or serious accessibility violations', () => {
    cy.visit('/login');
    cy.injectAxe();

    cy.checkA11y(null, { includedImpacts: ['critical', 'serious'] }, (violations) =>
      cy.logA11yViolations(violations),
    );
  });

  it('BUG-09: product links on the store home should have an accessible name', () => {
    cy.apiCreateUser().then((customer) => {
      cy.loginViaApi(customer);
      cy.visit('/home');
      cy.get('.card').should('have.length.greaterThan', 0);
      cy.injectAxe();

      cy.checkA11y(null, { runOnly: ['link-name'] }, (violations) => cy.logA11yViolations(violations));
    });
  });
});

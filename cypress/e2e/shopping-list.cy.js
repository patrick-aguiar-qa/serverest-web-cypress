describe('Store - search and shopping list', () => {
  let admin;
  let customer;
  let product;

  before(() => {
    cy.apiCreateUser({ admin: true }).then((user) => (admin = user));
    cy.apiCreateUser({ admin: false }).then((user) => (customer = user));
    cy.then(() => cy.apiCreateProduct(admin, { preco: 250, quantidade: 3 })).then((p) => (product = p));
  });

  beforeEach(() => {
    cy.loginViaApi(customer);
    cy.visit('/home');
  });

  it('should show only the matching product when searching by its exact name', () => {
    cy.searchProduct(product.nome);

    cy.get('.card').should('have.length', 1);
    cy.get('.card-title').should('have.text', product.nome);
  });

  it('should show a "no products" message when the search has no results', () => {
    cy.searchProduct('zzz-product-that-does-not-exist');

    cy.contains('p', 'Nenhum produto foi encontrado').should('be.visible');
    cy.get('.card').should('not.exist');
  });

  it('should show name, price, stock and description on the product details page', () => {
    cy.searchProduct(product.nome);
    cy.contains('.card', product.nome).contains('a', 'Detalhes').click();

    cy.get('[data-testid="product-detail-name"]').should('have.text', product.nome);
    cy.contains('h4', 'R$:').should('have.text', `R$: ${product.preco}`);
    cy.contains('h4', 'Quantidade:').should('have.text', `Quantidade: ${product.quantidade}`);
    cy.contains('h4', 'Descrição:').should('have.text', `Descrição: ${product.descricao}`);
  });

  it('should add a product to the shopping list with quantity 1', () => {
    cy.addProductToShoppingList(product.nome);

    cy.get('[data-testid="shopping-cart-product-name"]').should('have.text', `Produto:${product.nome}`);
    cy.get('[data-testid="shopping-cart-product-quantity"]').should('have.text', 'Total: 1');
    cy.contains('p', 'Preço R$').should('have.text', `Preço R$${product.preco}`);
  });

  it('should update quantity and total price when the quantity is increased', () => {
    cy.addProductToShoppingList(product.nome);

    cy.get('[data-testid="product-increase-quantity"]').click();

    cy.get('[data-testid="shopping-cart-product-quantity"]').should('have.text', 'Total: 2');
    cy.contains('p', 'Preço R$').should('have.text', `Preço R$${product.preco * 2}`);
  });

  it('should keep the shopping list when the customer goes back to the store', () => {
    cy.addProductToShoppingList(product.nome);

    cy.get('[data-testid="paginaInicial"]').click();
    cy.get('[data-testid="lista-de-compras"]').click();

    cy.get('[data-testid="shopping-cart-product-name"]').should('contain.text', product.nome);
  });

  it('should empty the shopping list when "Limpar Lista" is clicked', () => {
    cy.addProductToShoppingList(product.nome);

    cy.get('[data-testid="limparLista"]').click();

    cy.get('[data-testid="shopping-cart-empty-message"]').should('have.text', 'Seu carrinho está vazio');
  });
});

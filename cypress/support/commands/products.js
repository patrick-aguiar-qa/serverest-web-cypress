Cypress.Commands.add('searchProduct', (term) => {
  cy.get('[data-testid="pesquisar"]').click().type(term);
  cy.get('[data-testid="botaoPesquisar"]').click();
});

Cypress.Commands.add('addProductToShoppingList', (nome) => {
  cy.searchProduct(nome);
  cy.contains('.card', nome).find('[data-testid="adicionarNaLista"]').click();
  cy.location('pathname').should('equal', '/minhaListaDeProdutos');
});

Cypress.Commands.add('fillProductForm', ({ nome, preco, descricao, quantidade }) => {
  if (nome !== undefined) cy.get('[data-testid="nome"]').click().type(nome);
  if (preco !== undefined) cy.get('[data-testid="preco"]').click().type(String(preco));
  if (descricao !== undefined) cy.get('[data-testid="descricao"]').click().type(descricao);
  if (quantidade !== undefined) cy.get('[data-testid="quantity"]').click().type(String(quantidade));
});

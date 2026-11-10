describe('Admin - products', () => {
  let admin;

  before(() => {
    cy.apiCreateUser({ admin: true }).then((user) => (admin = user));
  });

  beforeEach(() => {
    cy.loginViaApi(admin);
    cy.visit('/admin/cadastrarprodutos');
  });

  it('should register a product and show it in the product list', () => {
    cy.fixture('product').then((fixture) => {
      cy.uniqueProductName().then((nome) => {
        cy.fillProductForm({ ...fixture, nome });
        cy.contains('button', 'Cadastrar').click();

        cy.location('pathname').should('equal', '/admin/listarprodutos');
        cy.contains('tr', nome).within(() => {
          cy.get('td').eq(1).should('have.text', String(fixture.preco));
          cy.get('td').eq(2).should('have.text', fixture.descricao);
          cy.get('td').eq(3).should('have.text', String(fixture.quantidade));
        });
        cy.trackProductByName(nome, admin);
      });
    });
  });

  it('should show an error when a product with the same name already exists', () => {
    cy.apiCreateProduct(admin).then((existing) => {
      cy.fillProductForm(existing);
      cy.contains('button', 'Cadastrar').click();

      cy.checkErrorAlert('Já existe produto com esse nome');
      cy.location('pathname').should('equal', '/admin/cadastrarprodutos');
    });
  });

  it('should show one error per required field when the form is submitted empty', () => {
    cy.contains('button', 'Cadastrar').click();

    cy.checkErrorAlert('Nome é obrigatório');
    cy.checkErrorAlert('Preco é obrigatório');
    cy.checkErrorAlert('Descricao é obrigatório');
    cy.checkErrorAlert('Quantidade é obrigatório');
  });

  describe('Price boundary (must be a positive integer)', () => {
    it('should show an error when the price is 0', () => {
      cy.fixture('product').then((fixture) => {
        cy.uniqueProductName().then((nome) => {
          cy.fillProductForm({ ...fixture, nome, preco: 0 });
          cy.contains('button', 'Cadastrar').click();

          cy.checkErrorAlert('Preco deve ser um número positivo');
        });
      });
    });

    it('should register the product when the price is 1', () => {
      cy.fixture('product').then((fixture) => {
        cy.uniqueProductName().then((nome) => {
          cy.fillProductForm({ ...fixture, nome, preco: 1 });
          cy.contains('button', 'Cadastrar').click();

          cy.location('pathname').should('equal', '/admin/listarprodutos');
          cy.contains('tr', nome).find('td').eq(1).should('have.text', '1');
          cy.trackProductByName(nome, admin);
        });
      });
    });
  });

  it('should remove a product from the list when "Excluir" is clicked', () => {
    cy.apiCreateProduct(admin).then((product) => {
      cy.visit('/admin/listarprodutos');

      cy.contains('tr', product.nome).contains('button', 'Excluir').click();

      cy.contains('h1', 'Lista dos Produtos').should('be.visible');
      cy.contains('tr', product.nome).should('not.exist');
    });
  });
});

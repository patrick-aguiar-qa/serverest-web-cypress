describe('Responsiveness', () => {
  const viewports = [
    { device: 'iphone-x', width: 375 },
    { device: 'ipad-2', width: 768 },
  ];

  let customer;

  before(() => {
    cy.apiCreateUser({ admin: false }).then((user) => (customer = user));
  });

  viewports.forEach(({ device, width }) => {
    describe(`${device} (${width}px)`, () => {
      beforeEach(() => {
        cy.viewport(device);
      });

      it('should keep the login form inside the screen and allow logging in', () => {
        cy.visit('/login');

        cy.get('form').then(($form) => {
          expect($form[0].getBoundingClientRect().right).to.be.at.most(width);
        });
        cy.loginViaUi(customer.email, customer.password);
        cy.location('pathname').should('equal', '/home');
      });

      it('should collapse the menu into the toggle button', () => {
        cy.loginViaApi(customer);
        cy.visit('/home');

        cy.get('.navbar-toggler').should('be.visible');
        cy.get('[data-testid="logout"]').should('not.be.visible');
      });
    });
  });
});

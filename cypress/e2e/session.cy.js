describe('Session', () => {
  const privatePages = ['/home', '/minhaListaDeProdutos', '/admin/home', '/admin/cadastrarprodutos'];

  privatePages.forEach((page) => {
    it(`should redirect to the login page when ${page} is opened without logging in`, () => {
      cy.visit(page);

      cy.location('pathname').should('equal', '/login');
    });
  });

  it('should end the session on logout so private pages are no longer accessible', () => {
    cy.apiCreateUser({ admin: true }).then((admin) => {
      cy.loginViaUi(admin.email, admin.password);
      cy.location('pathname').should('equal', '/admin/home');

      cy.get('[data-testid="logout"]').click();
      cy.location('pathname').should('equal', '/login');

      cy.visit('/admin/home');
      cy.location('pathname').should('equal', '/login');
      cy.window().its('localStorage.serverest/userToken').should('be.undefined');
    });
  });
});

Cypress.Commands.add('checkErrorAlert', (message) => {
  cy.get('[role="alert"]').contains('span', message).should('have.text', message);
});

Cypress.Commands.add('logA11yViolations', (violations) => {
  const summary = violations.map(({ id, impact, nodes }) => `${impact}: ${id} (${nodes.length} element(s))`);
  cy.task('log', `Accessibility violations:\n${summary.join('\n')}`);
});

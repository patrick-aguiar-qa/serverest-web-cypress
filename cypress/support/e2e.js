import 'cypress-mochawesome-reporter/register';
import 'cypress-axe';
import './commands/api';
import './commands/common';
import './commands/login';
import './commands/products';

// Remove the data each spec created on the shared public ServeRest server
after(() => {
  cy.apiCleanup();
});

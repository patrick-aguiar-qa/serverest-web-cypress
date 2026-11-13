# ServeRest Web Tests (Cypress)

![Web tests](https://github.com/patrick-aguiar-qa/serverest-web-cypress/actions/workflows/web-tests.yml/badge.svg)

End-to-end tests for the [ServeRest front-end](https://front.serverest.dev), a React e-commerce
built for testing practice: login, sign-up, admin product management, product search and shopping list.

**35 automated tests** covering functional flows, session handling, accessibility (axe / WCAG) and
responsiveness, plus **9 bugs found and documented** in [BUG_REPORTS.md](BUG_REPORTS.md).

This project is the web layer of a small QA portfolio on the same product:
[API tests](https://github.com/patrick-aguiar-qa/serverest-api-tests) ·
**Web tests** (this repo) ·
[Playwright + TypeScript](https://github.com/patrick-aguiar-qa/serverest-playwright-ts) ·
[Performance tests (k6)](https://github.com/patrick-aguiar-qa/serverest-k6-performance).

## Stack

| Tool | Purpose |
|---|---|
| [Cypress 15](https://www.cypress.io/) | E2E test runner (Mocha structure + Chai assertions) |
| [cypress-axe](https://github.com/component-driven/cypress-axe) + [axe-core](https://github.com/dequelabs/axe-core) | Accessibility checks (WCAG) |
| [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) | HTML report with embedded failure screenshots |
| GitHub Actions | Runs the suite headless on every push and pull request |

## What is tested

| Spec | Tests | Focus |
|---|---|---|
| `login.cy.js` | 6 | Admin and customer login, wrong password, required fields, HTML5 email validation, sign-up link |
| `sign-up.cy.js` | 5 | Customer and admin accounts, duplicate email, required fields |
| `session.cy.js` | 5 | Private pages redirect to login; logout really ends the session |
| `admin-products.cy.js` | 6 | Create, list and delete products; duplicate name; required fields; price boundary (`0 / 1`) |
| `shopping-list.cy.js` | 7 | Search (match / no results), product details, add to list, quantity × price calculation, clear list |
| `accessibility.cy.js` | 2 | No new critical or serious axe violations on login and sign-up |
| `responsive.cy.js` | 4 | Login and collapsed menu on iPhone X (375 px) and iPad (768 px) |

The test design follows the most common web defects: form validation, broken buttons, interrupted
journeys, calculation errors, wrong messages, sessions that do not end and unfriendly errors.

## Design decisions

- **Independent and repeatable tests:** every test creates its own users and products through the API
  (`cy.request`), with unique names, and the data is **deleted after each spec** — important because the
  public environment is shared.
- **UI login only where login is the goal;** other specs log in through the API and set the token the same
  way the front-end does, which keeps them fast and focused.
- **Readable locators:** `data-testid` attributes and `cy.contains('button', 'Entrar')`; no `force: true`.
- **Assertions on text and data,** not only on visibility (e.g. price × quantity, table cells, exact messages).
- **Known bugs are not "automated as correct":** tests for open bugs assert the expected behavior and live in
  `cypress/known-issues/`, outside the regression run, so the pipeline stays meaningful.
- **Retries:** 1 retry in `cypress run` to absorb network noise from the public environment; real failures
  still fail twice.

## Project structure

```
├── .github/workflows/web-tests.yml
├── cypress/
│   ├── e2e/                   # Regression suite (npm test)
│   ├── known-issues/          # Tests for open bugs, expected to fail
│   ├── fixtures/              # Test data (users.json, product.json)
│   └── support/
│       ├── e2e.js             # Plugins + cleanup after each spec
│       └── commands/
│           ├── api.js         # apiCreateUser, apiCreateProduct, apiLogin, apiCleanup
│           ├── common.js      # checkErrorAlert, logA11yViolations
│           ├── login.js       # loginViaUi, loginViaApi
│           └── products.js    # searchProduct, addProductToShoppingList, fillProductForm
├── cypress.config.js          # baseUrl, apiUrl, reporter, retries
└── BUG_REPORTS.md
```

## Getting started

**Requirements:** Node.js 20 or later.

```bash
git clone https://github.com/patrick-aguiar-qa/serverest-web-cypress.git
cd serverest-web-cypress
npm install
```

| Command | What it does |
|---|---|
| `npm test` | Runs the regression suite headless and creates `cypress/reports/index.html` |
| `npm run test:headed` | Same, with the browser window visible |
| `npm run cy:open` | Opens the Cypress app |
| `npm run test:known-issues` | Runs the tests for the open bugs (they fail on purpose) |

### Environments

`baseUrl` (front-end) and `apiUrl` (back-end) are set in `cypress.config.js` and can be overridden:

```bash
npx cypress run --config baseUrl=http://localhost:3000 --env apiUrl=http://localhost:3001
```

## Author

**Patrick Aguiar** — QA Engineer · [LinkedIn](https://www.linkedin.com/in/patrick-aguiar-qa) · [GitHub](https://github.com/patrick-aguiar-qa)

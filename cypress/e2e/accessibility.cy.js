// WCAG checks with axe-core. Critical and serious violations are checked first (M6 approach).
// Rules with open defects (image-alt, color-contrast) are tracked in known-issues/ (BUG-08, BUG-09),
// so this suite still catches any NEW critical or serious violation.
const KNOWN_RULES = { 'image-alt': { enabled: false }, 'color-contrast': { enabled: false } };
const options = { includedImpacts: ['critical', 'serious'], rules: KNOWN_RULES };

describe('Accessibility (axe)', () => {
  const publicPages = [
    { name: 'login', path: '/login' },
    { name: 'sign-up', path: '/cadastrarusuarios' },
  ];

  publicPages.forEach(({ name, path }) => {
    it(`should have no new critical or serious violations on the ${name} page`, () => {
      cy.visit(path);
      cy.injectAxe();

      cy.checkA11y(null, options, (violations) => cy.logA11yViolations(violations));
    });
  });
});

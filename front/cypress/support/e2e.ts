// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';

import '@cypress/code-coverage/support';
import './commands';

export function login(
  loginFixture: string,
  sessionListFixture = 'sessions.json'
) {
  cy.visit('/login');
  cy.intercept('POST', '/api/auth/login', {
    fixture: loginFixture,
  });
  cy.intercept('GET', '/api/session', {
    fixture: sessionListFixture,
  });

  // Remplir le formulaire de login et le soumettre
  cy.getByData('email-input').type('valid@email.com');
  cy.getByData('password-input').type('password123');
  cy.getByData('submit-button').click();

  cy.url().should('include', '/sessions');
}

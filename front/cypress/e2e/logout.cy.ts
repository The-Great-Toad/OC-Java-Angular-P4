import { login } from '../support/e2e';

describe('Logout spec', () => {
  beforeEach(() => {
    login('user-regular.json');
  });

  it('should logout successfully and redirect to home', () => {
    // Vérifier que l'utilisateur est connecté (navbar avec logout)
    cy.get('span').contains('Logout').should('be.visible');

    // Cliquer sur Logout
    cy.get('span').contains('Logout').click();

    // Vérifier la redirection vers la page d'accueil
    cy.url().should('contain', Cypress.config().baseUrl);

    // Vérifier que les liens Login et Register sont visibles
    cy.get('span').contains('Login').should('be.visible');
    cy.get('span').contains('Register').should('be.visible');

    // Vérifier que les liens Sessions et Account ne sont plus visibles
    cy.get('span').contains('Sessions').should('not.exist');
    cy.get('span').contains('Account').should('not.exist');
  });

  it('should not allow access to protected routes after logout', () => {
    // Logout
    cy.get('span').contains('Logout').click();
    cy.url().should('contain', Cypress.config().baseUrl);

    // Essayer d'accéder à /sessions
    cy.visit('/sessions');

    // Devrait être redirigé vers /login
    cy.url().should('include', '/login');
  });

  it('should clear session data after logout', () => {
    // Logout
    cy.get('span').contains('Logout').click();

    // Vérifier que le localStorage ou sessionStorage est vidé
    cy.window().then((window) => {
      const hasSessionData = window.sessionStorage.getItem('user') !== null;
      expect(hasSessionData).to.be.false;
    });
  });
});

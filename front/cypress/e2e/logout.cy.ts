describe('Logout spec', () => {
  beforeEach(() => {
    // Login
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      fixture: 'user-regular.json',
    });

    cy.intercept('GET', '/api/session', {
      fixture: 'sessions.json',
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.getByData('submit-button').should('exist').click();

    cy.url().should('include', '/sessions');
  });

  it('should logout successfully and redirect to home', () => {
    // Vérifier que l'utilisateur est connecté (navbar avec logout)
    cy.get('span').contains('Logout').should('be.visible');

    // Cliquer sur Logout
    cy.get('span').contains('Logout').click();

    // Vérifier la redirection vers la page d'accueil
    cy.url().should('eq', 'http://localhost:4200/');

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
    cy.url().should('eq', 'http://localhost:4200/');

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

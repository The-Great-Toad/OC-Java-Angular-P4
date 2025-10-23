describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  context('initial state', () => {
    it('should display the login page', () => {
      cy.getByData('page-title').should('exist').contains('Login');
    });

    it('should have disabled submit button with empty form', () => {
      cy.get('button[type=submit]').should('be.disabled');
    });
  });

  context('Form validation', () => {
    it('should show invalid input email field when email is not filled', () => {
      cy.getByData('email-input').focus().blur();
      cy.getByData('email-input').should('have.class', 'ng-invalid');
    });

    it('should show invalid input password field when password is not filled', () => {
      cy.getByData('password-input').focus().blur();
      cy.getByData('password-input').should('have.class', 'ng-invalid');
    });

    it('should have disabled submit button with invalid email', () => {
      cy.get('input[formControlName=email]').type('invalidemail');
      cy.get('input[formControlName=password]').type('password123');
      cy.get('button[type=submit]').should('be.disabled');
    });

    it('should enable submit button with valid form', () => {
      cy.get('input[formControlName=email]').type('valid@email.com');
      cy.get('input[formControlName=password]').type('password123');
      cy.get('button[type=submit]').should('not.be.disabled');
    });

    it('should display error message with invalid credentials', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        fixture: 'login-error.json',
      }).as('loginRequest');

      cy.get('input[formControlName=email]').type('wrong@test.com');
      cy.get('input[formControlName=password]').type('wrongpassword');
      cy.getByData('submit-button').should('exist').click();

      cy.wait('@loginRequest');

      cy.getByData('error-msg')
        .should('be.visible')
        .contains('An error occurred');
    });
  });

  context('Admin user journey', () => {
    it('should login successfully as admin', () => {
      executeLogin('user-admin.json');

      cy.getByData('detail-button').should('exist');
      cy.getByData('update-button').should('exist');
    });
  });

  context('Regular user journey', () => {
    it('should login successfully as regular user', () => {
      executeLogin('user-regular.json');

      cy.getByData('detail-button').should('exist');
      cy.getByData('update-button').should('not.exist');
    });
  });
});

function executeLogin(userToLoad: string) {
  // Mock de la réponse du backend pour le login
  cy.intercept('POST', '/api/auth/login', {
    fixture: userToLoad,
  }).as('loginRequest');

  // Mock de la liste des sessions
  cy.intercept('GET', '/api/session', {
    fixture: 'sessions.json',
  }).as('sessionList');

  // Remplir le formulaire
  cy.get('input[formControlName=email]').type('user@test.com');
  cy.get('input[formControlName=password]').type('password123');
  //   cy.get('input[formControlName=email]').type('yoga@studio.com');
  //   cy.get('input[formControlName=password]').type('test!1234');
  cy.getByData('submit-button').should('exist').click();

  // Vérifier que la requête a été appelée
  cy.wait('@loginRequest');

  // Vérifier la redirection vers /sessions
  cy.url().should('include', '/sessions');
  cy.getByData('page-title')
    .should('exist')
    .contains('Yoga Sessions available');
}

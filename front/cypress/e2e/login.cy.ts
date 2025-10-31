import { login } from '../support/e2e';

describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  context('initial state', () => {
    it('should display the login page', () => {
      cy.verifyPageTitle('Login');
    });

    it('should have disabled submit button with empty form', () => {
      cy.getByData('submit-button').should('be.disabled');
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
      cy.getByData('email-input').type('invalidemail');
      cy.getByData('password-input').type('password123');
      cy.getByData('submit-button').should('be.disabled');
    });

    it('should enable submit button with valid form', () => {
      cy.getByData('email-input').type('valid@email.com');
      cy.getByData('password-input').type('password123');
      cy.getByData('submit-button').should('not.be.disabled');
    });

    it('should display error message with invalid credentials', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        fixture: 'login-error.json',
      }).as('loginRequest');

      cy.getByData('email-input').type('wrong@test.com');
      cy.getByData('password-input').type('wrongpassword');
      cy.getByData('submit-button').should('exist').click();

      cy.wait('@loginRequest');

      cy.getByData('error-msg')
        .should('be.visible')
        .contains('An error occurred');
    });

    it('should show/hide password when toggle visibility is clicked', () => {
      cy.getByData('password-input').type('MySecretPassword');
      cy.getByData('toggle-password-visibility').click();
      cy.getByData('password-input').should('have.attr', 'type', 'text');

      cy.getByData('toggle-password-visibility').click();
      cy.getByData('password-input').should('have.attr', 'type', 'password');
    });
  });

  context('Admin user journey', () => {
    it('should login successfully as admin', () => {
      login('user-admin.json');

      cy.getByData('detail-button').should('exist');
      cy.getByData('update-button').should('exist');
    });
  });

  context('Regular user journey', () => {
    it('should login successfully as regular user', () => {
      login('user-regular.json');

      cy.getByData('detail-button').should('exist');
      cy.getByData('update-button').should('not.exist');
    });
  });
});

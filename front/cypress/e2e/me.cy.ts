import user from '../fixtures/user-regular.json';
import admin from '../fixtures/user-admin.json';

describe('Account page', () => {
  context('initial state', () => {
    before(() => {
      cy.visit('/me');
      login('user-regular.json');
      goToAccountPage(user.id, 'user-regular.json');
    });

    it('should display page title', () => {
      cy.verifyPageTitle('User information');
    });

    it('should display user name', () => {
      const userFullName = `${user.firstName} ${user.lastName.toUpperCase()}`;
      cy.getByData('user-name').should('contain', userFullName);
    });

    it('should display user email', () => {
      cy.getByData('user-email').should('contain', user.email);
    });

    it('should display delete button for regular user', () => {
      cy.getByData('delete-button').should('exist');
    });

    it('should display user creation date', () => {
      cy.getByData('user-created-at').should(
        'contain',
        getDisplayDate(user.createdAt)
      );
    });

    it('should display user last updated date', () => {
      cy.getByData('user-updated-at').should(
        'contain',
        getDisplayDate(user.updatedAt)
      );
    });
  });

  context('Regular user journey', () => {
    before(() => {
      cy.visit('/me');
      login('user-regular.json');
      goToAccountPage(user.id, 'user-regular.json');
    });

    it('should be able to delete account', () => {
      cy.intercept('DELETE', `/api/user/${user.id}`, {
        statusCode: 200,
      });

      cy.getByData('delete-button').click();

      cy.get('.mat-snack-bar-container')
        .should('exist')
        .contains('Your account has been deleted !');

      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });

  context('Admin user journey', () => {
    before(() => {
      cy.visit('/me');
      login('user-admin.json');
      goToAccountPage(admin.id, 'user-admin.json');
    });

    it('should display admin information without delete button', () => {
      cy.verifyPageTitle('User information');

      const adminFullName = `${
        admin.firstName
      } ${admin.lastName.toUpperCase()}`;
      cy.getByData('user-name').should('contain', adminFullName);
      cy.getByData('user-email').should('contain', admin.email);
      cy.getByData('delete-button').should('not.exist');
      cy.getByData('user-created-at').should(
        'contain',
        getDisplayDate(admin.createdAt)
      );
      cy.getByData('user-updated-at').should(
        'contain',
        getDisplayDate(admin.updatedAt)
      );
    });
  });
});

function login(fixture: string) {
  cy.intercept('POST', '/api/auth/login', {
    fixture: fixture,
  }).as('loginRequest');

  cy.intercept('GET', '/api/session', {
    fixture: 'sessions.json',
  }).as('sessionList');

  // Remplir le formulaire de login et le soumettre
  cy.getByData('email-input').type('valid@email.com');
  cy.getByData('password-input').type('password123');
  cy.getByData('submit-button').click();

  cy.url().should('include', '/sessions');
}

function goToAccountPage(userId: number, fixture: string) {
  cy.intercept('GET', `/api/user/${userId}`, {
    fixture: fixture,
  }).as('userRequest');

  cy.getByData('account-nav').click();
  cy.wait('@userRequest');
  cy.url().should('include', '/me');
}

function getDisplayDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

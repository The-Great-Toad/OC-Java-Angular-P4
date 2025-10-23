import sessionList from '../fixtures/sessions.json';

describe('Sessions page', () => {
  beforeEach(() => {
    cy.visit('/sessions');
  });

  context('initial state', () => {
    beforeEach(() => {
      login('user-regular.json');
    });

    it('should display the session list page', () => {
      verifyPageTitle();
    });

    it('should have 2 sessions listed', () => {
      cy.getByData('session-list').children().should('have.length', 2);
    });

    it('should have the correct session details', () => {
      cy.getByData('session-list')
        .children()
        .first()
        .within(() => {
          cy.getByData('session-name').should('contain', sessionList[0].name);
          cy.getByData('session-date').should(
            'contain',
            ' Session on December 15, 2024 '
          );
          cy.getByData('session-description').should(
            'contain',
            sessionList[0].description
          );
        });
    });
  });

  context('Regular user journey', () => {
    beforeEach(() => {
      login('user-regular.json');
    });

    it('should display the session list with correct action buttons', () => {
      verifyPageTitle();

      cy.getByData('create-button').should('not.exist');
      cy.getByData('detail-button').should('exist');
      cy.getByData('update-button').should('not.exist');
    });
  });

  context('Admin user journey', () => {
    beforeEach(() => {
      login('user-admin.json');
    });

    it('should display the session list with correct action buttons', () => {
      verifyPageTitle();

      cy.getByData('create-button').should('exist');
      cy.getByData('detail-button').should('exist');
      cy.getByData('update-button').should('exist');
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

function verifyPageTitle() {
  cy.getByData('page-title')
    .should('exist')
    .contains('Yoga Sessions available');
}

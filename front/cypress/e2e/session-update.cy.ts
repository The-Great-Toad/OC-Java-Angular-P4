import sessionToUpdate from '../fixtures/session-created.json';

describe('Sessions page', () => {
  context('initial state', () => {
    before(() => {
      cy.visit('/sessions/update/3');
      login('user-admin.json');
      goToUpdateForm();
    });

    it('should display the correct title page', () => {
      cy.getByData('update-title').should('contain', 'Update session');
    });

    it('should have a name input with session name', () => {
      cy.getByData('name-input')
        .should('exist')
        .and('have.value', sessionToUpdate.name);
    });

    it('should have a date input with session date', () => {
      cy.getByData('date-input')
        .should('exist')
        .and('have.value', sessionToUpdate.date.split('T')[0]);
    });

    it('should have a teacher select with session teacher', () => {
      cy.get('.mat-select-min-line').contains('Jane Smith');
    });

    it('should have a description textarea with session description', () => {
      cy.getByData('description-textarea')
        .should('exist')
        .and('have.value', sessionToUpdate.description);
    });

    it('should have a enabled save button', () => {
      cy.getByData('save-button').should('not.be.disabled');
    });
  });

  context('Admin user journey', () => {
    before(() => {
      cy.visit('/sessions/update/3');
      login('user-admin.json');
      goToUpdateForm();
    });

    it('should be able to update a session', () => {
      cy.intercept('PUT', '/api/session/3', {
        statusCode: 200,
        fixture: 'session-updated.json',
      }).as('updateRequest');

      cy.intercept('GET', '/api/session', {
        fixture: 'sessions-after-update.json',
      }).as('sessionList');

      updateSessionDetails();
      cy.getByData('save-button').click();
      cy.wait('@updateRequest');
      cy.wait('@sessionList');

      // Vérifier la redirection vers la liste des sessions
      cy.url().should('include', '/sessions');

      // Vérifier la présence du message de succès
      cy.get('.mat-snack-bar-container').should('contain', 'Session updated !');

      // Vérifier que la nouvelle session apparaît dans la liste des sessions
      cy.getByData('session-list')
        .children()
        .eq(2)
        .within(() => {
          cy.getByData('session-name').should(
            'contain',
            'Newly updated session'
          );
        });
    });
  });
});

function login(fixture: string) {
  cy.intercept('POST', '/api/auth/login', {
    fixture: fixture,
  }).as('loginRequest');

  cy.intercept('GET', '/api/session', {
    fixture: 'sessions-after-create.json',
  }).as('sessionList');

  // Remplir le formulaire de login et le soumettre
  cy.getByData('email-input').type('valid@email.com');
  cy.getByData('password-input').type('password123');
  cy.getByData('submit-button').click();

  cy.url().should('include', '/sessions');
}

function goToUpdateForm() {
  cy.intercept('GET', '/api/session/3', {
    fixture: 'session-created.json',
  }).as('sessionDetails');

  cy.intercept('GET', '/api/teacher', {
    fixture: 'teachers.json',
  }).as('teacherList');

  cy.getByData('session-list')
    .children()
    .eq(2)
    .within(() => {
      cy.getByData('update-button').click();
    });

  cy.wait('@sessionDetails');
  cy.wait('@teacherList');

  cy.url().should('include', '/sessions/update/3');
}

function updateSessionDetails() {
  cy.getByData('name-input').clear().type('Newly updated session');
  cy.getByData('date-input').clear().type('2025-10-19');
  cy.getByData('teacher-select')
    .click()
    .get('mat-option')
    .contains('Mike Johnson')
    .click();
  cy.getByData('description-textarea')
    .clear()
    .type('Session updated description');
}

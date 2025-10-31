import { login } from '../support/e2e';

describe('Sessions page', () => {
  before(() => {
    login('user-admin.json');
    goToCreateForm();
  });

  context('initial state', () => {
    it('should display the correct title page', () => {
      cy.getByData('create-title').should('contain', 'Create session');
    });

    it('should have a name input', () => {
      cy.getByData('name-input').should('exist');
    });

    it('should have a date input', () => {
      cy.getByData('date-input').should('exist');
    });

    it('should have a teacher select', () => {
      cy.getByData('teacher-select').should('exist');
    });

    it('should have a description textarea', () => {
      cy.getByData('description-textarea').should('exist');
    });

    it('should have a disabled save button', () => {
      cy.getByData('save-button').should('be.disabled');
    });
  });

  context('Form validation', () => {
    it('should show invalid input name field when name is not filled', () =>
      cy.checkInputValidity('name-input'));

    it('should show invalid input date field when date is not filled', () =>
      cy.checkInputValidity('date-input'));

    it('should show invalid select teacher field when teacher is not selected', () =>
      cy.checkInputValidity('teacher-select'));

    it('should show invalid input description field when description is not filled', () =>
      cy.checkInputValidity('description-textarea'));

    it('should enable save button with valid form', () => {
      fillCreateForm();

      cy.getByData('save-button').should('not.be.disabled');
    });
  });

  context('Admin user journey', () => {
    before(() => {
      login('user-admin.json');
      goToCreateForm();
    });
    it('should be able to create a session', () => {
      cy.intercept('POST', '/api/session', {
        statusCode: 200,
        fixture: 'session-created.json',
      }).as('createRequest');

      cy.intercept('GET', '/api/session', {
        fixture: 'sessions-after-create.json',
      }).as('sessionList');

      fillCreateForm();
      cy.getByData('save-button').click();
      cy.wait('@createRequest');
      cy.wait('@sessionList');

      // Vérifier la redirection vers la liste des sessions
      cy.url().should('include', '/sessions');

      // Vérifier la présence du message de succès
      cy.get('.mat-snack-bar-container').should('contain', 'Session created !');

      // Vérifier que la nouvelle session apparaît dans la liste des sessions
      cy.getByData('session-list').should('contain', 'Newly created session');
    });
  });
});

function goToCreateForm() {
  cy.intercept('GET', '/api/teacher', {
    fixture: 'teachers.json',
  }).as('teacherList');

  cy.getByData('create-button').click();

  cy.url().should('include', '/sessions/create');
  cy.wait('@teacherList');
}

function fillCreateForm() {
  cy.getByData('name-input').type('Newly created session');
  cy.getByData('date-input').type('2025-10-18');
  cy.getByData('teacher-select')
    .click()
    .get('mat-option')
    .contains('Jane Smith')
    .click();
  cy.getByData('description-textarea').type('Session description');
}

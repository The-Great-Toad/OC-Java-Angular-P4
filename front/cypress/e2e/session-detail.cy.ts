import sessionParticipate from '../fixtures/session-details-participate.json';
import sessionUnparticipate from '../fixtures/session-details-unparticipate.json';
import teacher from '../fixtures/teacher.json';
import user from '../fixtures/user-regular.json';

describe('Session details page', () => {
  context('initial state', () => {
    before(() => {
      cy.visit('/sessions/detail/1');
      login('user-regular.json');
      goToSessionDetail('session-details-unparticipate.json');
    });

    it('should display the session name', () => {
      cy.getByData('session-name').should('contain', sessionUnparticipate.name);
    });

    it('should display the teacher name', () => {
      const teacherLastnameUpper = teacher.lastName.toUpperCase();
      const teacherFullName = `${teacher.firstName} ${teacherLastnameUpper}`;
      cy.getByData('session-teacher').should('contain', teacherFullName);
    });

    it('should display the session image', () => {
      cy.getByData('session-image').should('exist');
    });

    it('should display the session attendees', () => {
      cy.getByData('session-attendees').should(
        'contain',
        `${sessionUnparticipate.users.length} attendees`
      );
    });

    it('should display the session date', () => {
      cy.getByData('session-date').should('contain', 'December 15, 2024');
    });

    it('should display the session description', () => {
      cy.getByData('session-description').should(
        'contain',
        sessionUnparticipate.description
      );
    });

    it('should display the session created date', () => {
      cy.getByData('session-created-date').should('contain', 'Create at:');
    });

    it('should display the session updated date', () => {
      cy.getByData('session-updated-date').should('contain', 'Last update:');
    });
  });

  context('Regular user journey - Unparticipate', () => {
    before(() => {
      cy.visit('/sessions/detail/1');
      login('user-regular.json');
      goToSessionDetail('session-details-unparticipate.json');
    });

    it('should display the session details with correct action buttons', () => {
      cy.getByData('delete-button').should('not.exist');
      cy.getByData('participate-button').should('exist');
      cy.getByData('unparticipate-button').should('not.exist');
    });

    it('should be able to participate to the session', () => {
      // Vérifier que l'utilisateur n'est pas encore inscrit
      cy.getByData('unparticipate-button').should('not.exist');
      cy.getByData('participate-button').should('exist');

      // Simuler la participation à la session et le rechargement des détails de la session
      cy.intercept('POST', `/api/session/1/participate/${user.id}`, {
        statusCode: 200,
      }).as('participateRequest');

      cy.intercept('GET', `/api/session/1`, {
        fixture: 'session-details-participate.json',
      }).as('sessionDetails');

      // Cliquer sur le bouton "Participate"
      cy.getByData('participate-button').click();

      cy.wait('@participateRequest');
      cy.wait('@sessionDetails');

      // Vérifier que l'utilisateur est maintenant inscrit
      cy.getByData('unparticipate-button').should('exist');
      cy.getByData('participate-button').should('not.exist');
    });

    it('should be able to unparticipate from the session', () => {
      // Simuler la désinscription à la session et le rechargement des détails de la session
      cy.intercept('DELETE', `/api/session/1/participate/${user.id}`, {
        statusCode: 200,
      }).as('unparticipateRequest');

      cy.intercept('GET', `/api/session/1`, {
        fixture: 'session-details-unparticipate.json',
      }).as('sessionDetails');

      // Cliquer sur le bouton "Unparticipate"
      cy.getByData('unparticipate-button').click();

      cy.wait('@unparticipateRequest');
      cy.wait('@sessionDetails');

      // Vérifier que l'utilisateur est maintenant désinscrit
      cy.getByData('unparticipate-button').should('not.exist');
      cy.getByData('participate-button').should('exist');
    });
  });

  context('Admin user journey', () => {
    before(() => {
      cy.visit('/sessions/detail/1');
      login('user-admin.json');
      goToSessionDetail('session-details-participate.json');
      cy.url().should('include', `/sessions/detail/1`);
    });

    it('should display the session details with correct action buttons', () => {
      cy.getByData('delete-button').should('exist');
      cy.getByData('participate-button').should('not.exist');
      cy.getByData('unparticipate-button').should('not.exist');
    });

    it.only('should be able to delete the session', () => {
      // Simuler la suppression de la session
      cy.intercept('DELETE', `/api/session/1`, {
        statusCode: 200,
      }).as('deleteRequest');

      cy.intercept('GET', `/api/session`, {
        statusCode: 200,
        fixture: 'sessions-after-delete.json',
      }).as('updatedSessionList');

      // Cliquer sur le bouton "Delete"
      cy.getByData('delete-button').click();

      cy.wait('@deleteRequest');
      cy.wait('@updatedSessionList');

      // Vérifier la redirection vers la liste des sessions
      cy.url().should('include', `/sessions`);

      // Vérifier la présence du message de confirmation
      cy.get('.mat-snack-bar-container').should('contain', 'Session deleted !');

      // Vérifier que la session n'apparaît plus dans la liste des sessions
      cy.getByData('session-list').should(
        'not.contain',
        sessionParticipate.name
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

function goToSessionDetail(sessionFixture: string) {
  cy.intercept('GET', `/api/session/1`, {
    fixture: sessionFixture,
  }).as('sessionDetails');

  cy.intercept('GET', `/api/teacher/1`, {
    fixture: 'teacher.json',
  }).as('teacher');

  cy.getByData('session-list')
    .children()
    .eq(0)
    .within(() => {
      cy.getByData('detail-button').click();
    });

  cy.url().should('include', `/sessions/detail/1`);
}

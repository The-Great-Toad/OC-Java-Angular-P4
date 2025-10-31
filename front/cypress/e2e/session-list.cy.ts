import sessionList from '../fixtures/sessions.json';
import { login } from '../support/e2e';

describe('Sessions page', () => {
  context('initial state', () => {
    beforeEach(() => {
      login('user-regular.json');
    });

    it('should display the session list page', () => {
      cy.verifyPageTitle('Yoga Sessions available');
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
      cy.verifyPageTitle('Yoga Sessions available');

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
      cy.verifyPageTitle('Yoga Sessions available');

      cy.getByData('create-button').should('exist');
      cy.getByData('detail-button').should('exist');
      cy.getByData('update-button').should('exist');
    });
  });
});

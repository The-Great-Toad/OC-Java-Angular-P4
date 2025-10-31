import { login } from '../support/e2e';

describe('Not Found page', () => {
  beforeEach(() => {
    login('user-regular.json');
  });

  it('should display an h1 with "Page not found !"', () => {
    cy.visit('/not-found');

    cy.get('h1').should('contain', 'Page not found !');
  });
});

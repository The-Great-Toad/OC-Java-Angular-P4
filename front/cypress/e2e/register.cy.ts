describe('Register page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  context('initial state', () => {
    it('should display the register page', () => {
      cy.getByData('page-title').should('exist').contains('Register');
    });

    it('should have disabled submit button with empty form', () => {
      cy.getByData('submit-button').should('be.disabled');
    });
  });

  context('Form validation', () => {
    it('should show invalid input first name field when first name is not filled', () =>
      cy.checkInputValidity('firstname-input'));

    it('should show invalid input lastname field when lastname is not filled', () =>
      cy.checkInputValidity('lastname-input'));

    it('should show invalid input email field when email is not filled', () =>
      cy.checkInputValidity('email-input'));

    it('should show invalid input password field when password is not filled', () =>
      cy.checkInputValidity('password-input'));

    it('should have disabled submit button with invalid email', () => {
      cy.getByData('email-input').type('invalidemail');
      cy.getByData('password-input').type('password123');
      cy.getByData('submit-button').should('be.disabled');
    });

    it('should enable submit button with valid form', () => {
      fillRegistrationForm();

      cy.getByData('submit-button').should('not.be.disabled');
    });
  });

  context('User journey', () => {
    it('should register successfully', () => {
      // Mock de la réponse du backend pour la registration
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 200,
      }).as('registerRequest');

      // Mock de la réponse du backend pour le login
      cy.intercept('POST', '/api/auth/login', {
        fixture: 'user-regular.json',
      }).as('loginRequest');

      // Mock de la liste des sessions
      cy.intercept('GET', '/api/session', {
        fixture: 'sessions.json',
      }).as('sessionList');

      // Remplir le formulaire de registration et le soumettre
      fillRegistrationForm();
      cy.getByData('submit-button').should('exist').click();

      // Vérifier la redirection vers la page de login
      cy.url().should('include', '/login');

      // Remplir le formulaire de login et le soumettre
      cy.getByData('email-input').type('valid@email.com');
      cy.getByData('password-input').type('password123');
      cy.getByData('submit-button').click();

      // Vérifier que la requête a été appelée
      cy.wait('@loginRequest');

      // Vérifier la redirection vers /sessions
      cy.url().should('include', '/sessions');
      cy.getByData('page-title')
        .should('exist')
        .contains('Yoga Sessions available');

      cy.getByData('detail-button').should('exist');
      cy.getByData('update-button').should('not.exist');
    });
  });
});

function fillRegistrationForm() {
  cy.getByData('firstname-input').type('John');
  cy.getByData('lastname-input').type('Doe');
  cy.getByData('email-input').type('valid@email.com');
  cy.getByData('password-input').type('password123');
}

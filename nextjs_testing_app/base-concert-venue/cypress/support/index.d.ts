/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to ... add your description here
     * @example cy.resetDbAndIsrCache()
     */
    resetDbAndIsrCache(): Chainable<null>;
    signIn(email: string, password: string): Chainable<null>;
  }
}

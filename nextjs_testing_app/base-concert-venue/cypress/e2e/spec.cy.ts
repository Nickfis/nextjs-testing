import "@testing-library/cypress/";

describe("routing tests", () => {
  it("displays correct heading when navigating to shows route", () => {
    cy.visit("/");
    cy.findByRole("button", { name: /shows/i }).click();
    cy.findByRole("heading", { name: /upcoming shows/i }).should("exist");
  });
});

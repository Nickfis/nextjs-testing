import { generateNewBand } from "../../../__tests__/__mocks__/fakeData/newBand";
import { generateRandomId } from "../../../lib/features/reservations/utils";

it("displays correct heading when navigating to shows route", () => {
  cy.visit("/");
  cy.findByRole("button", { name: /shows/i }).click();
  cy.findByRole("heading", { name: /upcoming shows/i }).should("exist");
});

it("Displays correct heading on bands page", () => {
  cy.visit("/");
  cy.findByRole("button", { name: /bands/i }).click();
  cy.findByRole("heading", { name: /our illustrious performers/i }).should(
    "exist"
  );
});

it("displays correct band name for a band that existed at build time in db", () => {
  cy.task("db:reset").visit("/bands/1");
  cy.findByRole("heading", { name: /Shamrock Pete/i }).should("exist");
});

// search for: error: band not found
it("show error when looking for a band of a page that does not exist", () => {
  cy.task("db:reset").visit("bands/12345");
  cy.findByText(/band not found/i).should("exist");
});

it("Displays name for band that was not present at build time, but is now", () => {
  const bandId = generateRandomId();
  const newBand = generateNewBand(bandId);
  cy.task("db:reset").task("addBand", newBand).visit(`/bands/${bandId}`);
  cy.findByRole("heading", { name: /Avalanche of/i }).should("exist");
});

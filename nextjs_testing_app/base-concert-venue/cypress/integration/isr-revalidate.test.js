import { generateNewBand } from "../../__tests__/__mocks__/fakeData/newBand";
import { generateNewShow } from "../../__tests__/__mocks__/fakeData/newShow";
import { generateRandomId } from "../../lib/features/reservations/utils";

it("should load refreshed page from cache after new band is added", async () => {
  // check that new band is not on page
  cy.task("db:reset").visit("/bands");
  cy.findByRole("heading", { name: /avalanche of cheese/i }).should(
    "not.exist"
  );

  // add new band via post request to api
  const bandId = generateRandomId();
  const band = generateNewBand(bandId);
  const secret = Cypress.env("REVALIDATION_SECRET");

  cy.request("POST", `/api/bands?secret=${secret}`, { newBand: band }).then(
    (response) => {
      expect(response.body.revalidated).to.equal(true);
    }
  );

  // reload page; new band should appear
  cy.reload();
  cy.findByRole("heading", { name: /avalanche of cheese/i }).should("exist");

  // reset ISR cache to initial db conditions
  cy.resetDbAndIsrCache();
});

it("add show and check that it didn't exist before but exists after refresh", () => {
  // reset db
  cy.task("db:reset").visit("/shows");
  cy.findByRole("heading", { name: /avalanche of cheese/i }).should(
    "not.exist"
  );

  // add show to database
  const secret = Cypress.env("REVALIDATION_SECRET");
  const newShow = generateNewShow(10);
  cy.request("POST", `/api/shows?secret=${secret}`, { newShow }).then(
    (response) => expect(response.body.revalidated).to.equal(true)
  );

  // reload page and check out whether show now exists
  cy.reload();
  cy.findByRole("heading", { name: /avalanche of cheese/i }).should("exist");

  // reset ISR cache to initial db conditions
  cy.resetDbAndIsrCache();
});

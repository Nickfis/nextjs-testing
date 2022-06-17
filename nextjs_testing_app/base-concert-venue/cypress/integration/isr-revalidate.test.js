import { generateNewBand } from "../../__tests__/__mocks__/fakeData/newBand";
import { generateRandomId } from "../../lib/features";

it("Should load refreshed page from cache after new band is added", async () => {
  // check that new band is not on page
  cy.task("db:reset").visit("/bands");
  cy.findbyRole("heading", { name: /avalanche of cheese/i }).should(
    "not.exist"
  );
  // add new band via post request
  const bandId = generateRandomId();
  const band = generateNewBand();

  const response = await cy.request("POST", `/api/bands?secret=${secret}`, {
    newBand: band,
  });
  expect(response.body.revalidated).to.equal(true);

  // reload page; new band should appear
  cy.reload();
  cy.findbyRole("heading", { name: /avalanche of cheese/i }).should("exist");
});

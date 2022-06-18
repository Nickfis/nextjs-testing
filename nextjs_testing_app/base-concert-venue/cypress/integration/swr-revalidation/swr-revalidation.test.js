import { generateNewReservation } from "../../../__tests__/__mocks__/fakeData/newReservation";
import { generateRandomId } from "../../../lib/features/reservations/utils";

const ONE_SECOND = 1000;
const FIFTEEN_SECONDS = 15 * ONE_SECOND;
const THIRTY_SECONDS = 30 * ONE_SECOND;

it("should refresh the shows page after 30 seconds", () => {
  cy.clock();
  cy.task("db:reset").visit("/shows");

  // there should only be one sold-out show
  cy.findAllByText(/sold out/i).should("have.length", 1);

  // buy all tickets for first show (from fakeData file: id 0, 10 seats available)
  const newReservation = generateNewReservation({
    reservationId: generateRandomId(),
    showId: 0,
    seatCount: 10,
  });
  cy.task("addReservation", newReservation);

  //   go forward one second and check that show doesn't show up as sold out yet
  cy.tick(ONE_SECOND);
  cy.findAllByText(/sold out/i).should("have.length", 1);

  //   now advance clock by 30 seconds (overall 31 seconds since reservation made)
  // since that is larger than the SWR interval, we should see two shows sold out
  cy.tick(THIRTY_SECONDS);
  cy.findAllByText(/sold out/i).should("have.length", 2);

  // reset ISR cache to initial db conditions
  cy.resetDbAndIsrCache();
});

it("updates ticket count by fetching data from db after interval passed", () => {
  cy.task("db:reset");
  cy.clock();

  cy.visit("/reservations/0");

  cy.findByRole("main").within(() =>
    cy.findByRole("button", { name: /sign in/i }).click()
  );

  cy.findByRole("heading", { name: /10 seats left/i }).should("exist");

  //   cy.findByRole("button", { name: /purchase/i }).click();
  // buy all tickets for first show (from fakeData file: id 0, 10 seats available)
  const newReservation = generateNewReservation({
    reservationId: generateRandomId(),
    showId: 0,
    seatCount: 2,
  });
  cy.task("addReservation", newReservation);

  cy.tick(ONE_SECOND);
  cy.findByRole("heading", { name: /10 seats left/i }).should("exist");

  cy.tick(FIFTEEN_SECONDS);
  cy.findByRole("heading", { name: /8 seats left/i }).should("exist");

  cy.resetDbAndIsrCache();
});

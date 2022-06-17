import { defineConfig } from "cypress";
import { addBand } from "./lib/features/bands/queries";
import { addReservation } from "./lib/features/reservations/queries";
import { resetDb } from "./__tests__/__mocks__/db/utils/reset-db";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: [
      "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
      "cypress/integration/**/*.{js,jsx,ts,tsx}",
    ],
    setupNodeEvents(on, config) {
      // use environment variables in cypress config
      // to then use in test:
      // Cypress.env("REVALIDATION_SECRET")
      config.env.REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;
      // implement node event listeners here
      on("task", {
        "db:reset": () => resetDb().then(() => null),
        addBand: (newBand) => addBand(newBand).then(() => null),
        addReservation: (newReservation) =>
          addReservation(newReservation).then(() => null),
      });
      return config;
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});

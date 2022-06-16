import { defineConfig } from "cypress";
import { resetDb } from "./__tests__/__mocks__/db/utils/reset-db";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: [
      "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
      "cypress/integration/**/*.{js,jsx,ts,tsx}",
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        "db:reset": () => resetDb().then(() => null),
      });
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});

it("runs auth flow for successful login to protected reservations page", () => {
  cy.task("db:reset").visit("/reservations/0");

  //   check for sign in form
  cy.findByRole("heading", { name: /Sign in to your account/i }).should(
    "exist"
  );

  //   no option to purchase tickets
  cy.findByRole("button", { name: /purchase/i }).should("not.exist");

  //   sign in with valid credentials coming from env.test file
  cy.findByLabelText(/email address/i)
    .clear()
    .type(Cypress.env("TEST_USER_EMAIL"));
  cy.findByLabelText(/password/i)
    .clear()
    .type(Cypress.env("TEST_PASSWORD"));

  // submit the form
  cy.findByRole("main").within(() => {
    cy.findByRole("button", { name: /sign in/i }).click();
  });

  //   check for purchase button and band name
  cy.findByRole("button", { name: /purchase/i }).should("exist");
  cy.findByRole("heading", { name: /bunnies/i }).should("exist");

  //   check for email and sign-out button on navbar
  cy.findByRole("button", { name: Cypress.env("TEST_USER_EMAIL") }).should(
    "exist"
  );
  cy.findByRole("button", { name: /sign out/i }).should("exist");

  //   check that sign in button does not exist
  cy.findByRole("button", { name: /sign in/i }).should("not.exist");
});

it("should give you a failure when using wrong credentials", () => {
  cy.task("db:reset").visit("/user");

  cy.findByRole("heading", { name: /sign in to your account/i }).should(
    "exist"
  );
  cy.findByRole("button", { name: /log out/i }).should("not.exist");

  //   fail the login
  cy.findByLabelText(/email address/i)
    .clear()
    .type("Random@gmail.com");
  cy.findByLabelText(/password/i)
    .clear()
    .type("wrongPassword");

  cy.findByRole("main").within(() =>
    cy.findByRole("button", { name: /sign in/i }).click()
  );
  // check for error message
  cy.findByText(/sign in failed/i).should("exist");
  cy.findByRole("button", { name: Cypress.env("TEST_USER_EMAIL") }).should(
    "not.exist"
  );

  //   sign in successfully
  cy.findByLabelText(/email address/i)
    .clear()
    .type(Cypress.env("TEST_USER_EMAIL"));
  cy.findByLabelText(/password/i)
    .clear()
    .type(Cypress.env("TEST_PASSWORD"));

  cy.findByRole("main").within(() =>
    cy.findByRole("button", { name: /sign in/i }).click()
  );

  cy.url().should("be.equal", `${Cypress.config("baseUrl")}/user`);
});

it("redirects to sign-in for protected pages", () => {
  cy.fixture("protected-pages.json").then((urls) => {
    urls.forEach((url) => {
      cy.visit(url);
      cy.findByLabelText(/email address/i).should("exist");
    });
  });
});

it("does not show the sign-in page when already signed in", () => {
  cy.task("db:reset").signIn(
    Cypress.env("TEST_USER_EMAIL"),
    Cypress.env("TEST_PASSWORD")
  );

  cy.visit("/reservations/0");

  cy.findByRole("heading", { name: /sign in to your account/i }).should(
    "not.exist"
  );

  cy.findByRole("button", { name: /purchase/i }).should("exist");
});

// sign in to page
// go to /user page
// find and click the purchase more tickets buton
// check that we're ending up on upcoming shows site
it("purchase more tickets button works on authenticated user page", () => {
  cy.task("db:reset").signIn(
    Cypress.env("TEST_USER_EMAIL"),
    Cypress.env("TEST_PASSWORD")
  );

  cy.visit("/user");
  cy.findByText(/purchase more tickets/i).click();
  cy.url().should("be.equal", `${Cypress.config("baseUrl")}/shows`);
});

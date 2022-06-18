it("if there is no javascript on the page, we should still see the data being included in page source code (from ISR Cache)", () => {
  cy.request("/shows")
    .its("body")
    .then((html) => {
      // remove the scripts, so they don't start automatically
      //   Flags regex:
      // g: match globally, not just the first you find
      // m: Match across lines as well (multiline)
      const staticHtml = html.replace(/<script.*?>.*?>\/script>/gm, "");
      cy.state("document").write(staticHtml);
    });

  // my solution
  cy.get("main ul > li").should("have.length.of", 3);

  // course solution
  cy.findByRole("heading", { name: /the wandering bunnies/i }).should("exist");
  cy.findByRole("heading", { name: /shamrock pete/i }).should("exist");
  cy.findByRole("heading", { name: /the joyous nun riot/i }).should("exist");
});

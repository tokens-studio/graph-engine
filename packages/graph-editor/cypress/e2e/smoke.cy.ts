

context("Smoke", () => {

  it("can load the login page", () => {
    cy.visit("/")
    cy.waitForReact(1000, '#root');
    cy.react('GraphView').should("exist");
    cy.react('DropPanel').should("exist")
  })

})

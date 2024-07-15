context('Smoke', () => {
  it('can load the  page', () => {
    cy.visit('/');
    cy.waitForReact(2000);
    cy.react('Editor').should('exist');
    cy.react('DropPanel').should('exist');
    cy.react('GraphToolbar').should('exist');
  });
});

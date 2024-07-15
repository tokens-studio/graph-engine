describe('Nodes', () => {
  it('can create a node from the drop panel', () => {
    cy.visit('/');
    cy.waitForReact(1000);
    //Open the first group
    cy.react('DropPanel').should('exist');
    cy.react('DropPanel').react('Styled.AccordionTrigger').first().click();
    cy.react('DragItem')
      .first()
      .drag('[data-testid="rf__wrapper"]')
      .then((success) => {
        assert.isTrue(success);
      });
    // A node should have been created
    cy.get('.react-flow__node').should('exist');
  });
});

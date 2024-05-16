describe('Nodes', () => {
  it('can create a node from the drop panel', () => {
    cy.visit('/')
    cy.get('[data-test-class="drop-panel-trigger"]').first().click()
    cy.get('[data-test-class="drop-panel-item"]').first().drag('[data-testid="rf__wrapper"]').then((success) => {
      assert.isTrue(success)
    })
    // A node should have been created
    cy.get('.react-flow__node').should('exist')
  })
})
describe('Product E2E Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4173')
        cy.get('[data-testid="username-input"]').clear().type('admin')
        cy.get('[data-testid="password-input"]').clear().type('Admin123')
        cy.get('[data-testid="login-button"]').click()
        cy.get('[data-testid="login-error"]').should('not.exist')
    })
})
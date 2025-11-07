describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4173')
  })

  it('Hiển thị form đăng nhập', () => {
    cy.get('[data-testid="username-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
  })

  it('Đăng nhập thành công với thông tin hợp lệ', () => {

    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token' },
    }).as('loginRequest')

    cy.get('[data-testid="username-input"]').clear().type('admin')
    cy.get('[data-testid="password-input"]').clear().type('Admin123')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@loginRequest', { timeout: 10000 })
      .its('response.statusCode')
      .should('eq', 200)

    cy.get('[data-testid="login-error"]').should('not.exist')
  })

  it('Hiển thị lỗi khi nhập sai thông tin', () => {
    cy.get('[data-testid="username-input"]').clear().type('wronguser')
    cy.get('[data-testid="password-input"]').clear().type('wrongpass')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Password must include both letters and numbers'
    )
  })
})

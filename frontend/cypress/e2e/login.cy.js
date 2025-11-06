describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('Hiển thị form đăng nhập', () => {
    cy.get('[data-testid="username-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
  })

  it('Đăng nhập thành công với thông tin hợp lệ', () => {
    // intercept PHẢI đặt trước khi click
    cy.intercept('POST', '**/api/auth/login').as('loginRequest')

    cy.get('[data-testid="username-input"]').clear().type('admin')
    cy.get('[data-testid="password-input"]').clear().type('Admin123')
    cy.get('[data-testid="login-button"]').click()

    // Đợi và xác nhận request gửi thành công
    cy.wait('@loginRequest', { timeout: 10000 })
      .its('response.statusCode')
      .should('eq', 200)

    // Kiểm tra không hiển thị lỗi
    cy.get('[data-testid="login-error"]').should('not.exist')
  })

  it('Hiển thị lỗi khi nhập sai thông tin', () => {
    cy.get('[data-testid="username-input"]').clear().type('wronguser')
    cy.get('[data-testid="password-input"]').clear().type('wrongpass')
    cy.get('[data-testid="login-button"]').click()

    // Kiểm tra thông báo lỗi hiển thị đúng
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Password must include both letters and numbers'
    )
  })
})

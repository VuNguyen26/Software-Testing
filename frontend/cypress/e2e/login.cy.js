describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173') // Đảm bảo port đúng với máy bạn
  })

  // --- YÊU CẦU D: Test UI Elements ---
  it('Hiển thị form đăng nhập đầy đủ', () => {
    cy.get('[data-testid="username-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
  })

  // --- YÊU CẦU A & C (Success): Test luồng thành công ---
  it('Đăng nhập thành công và chuyển hướng', () => {
    // Mock API thành công
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token-123', user: { name: 'Admin' } },
    }).as('loginRequest')

    cy.get('[data-testid="username-input"]').clear().type('admin')
    cy.get('[data-testid="password-input"]').clear().type('Admin123')
    cy.get('[data-testid="login-button"]').click()

    // Chờ API gọi xong
    cy.wait('@loginRequest', { timeout: 10000 })
      .its('response.statusCode')
      .should('eq', 200)
    // Kiểm tra chuyển hướng đến dashboard
    cy.url().should('include', '/products') 
  })

  // --- YÊU CẦU B: Test Validation (Quan trọng - Bị thiếu) ---
  it('Hiển thị lỗi khi để trống thông tin (Validation)', () => {
    cy.get('[data-testid="username-input"]').clear()
    cy.get('[data-testid="password-input"]').clear()
    // Không nhập gì cả, bấm Login luôn
    cy.get('[data-testid="login-button"]').click()

    // Kiểm tra thông báo lỗi "Required"
    cy.get('[data-testid="login-error"]').should('be.visible')
    .and('contain.text', 'Username is required')
    cy.get('[data-testid="login-error"]').should('be.visible')
    .and('contain.text', 'Password is required')
  })

  // --- YÊU CẦU C (Error): Test lỗi API/Logic ---
  it('Hiển thị lỗi khi nhập sai Password (Logic/Format)', () => {
    cy.get('[data-testid="username-input"]').clear().type('admin')
    cy.get('[data-testid="password-input"]').clear().type('onlyletters') // Sai format (thiếu số)
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="login-error"]').should('be.visible')
    .and('contain.text', 'Password must include both letters and numbers')
  })
  
  it('Hiển thị lỗi khi API trả về 401 (Authentication Failed)', () => {
     cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginFail')

    cy.get('[data-testid="username-input"]').clear().type('admin')
    cy.get('[data-testid="password-input"]').clear().type('WrongPass123')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@loginFail')
    cy.contains('Invalid credentials').should('be.visible')
  })
})
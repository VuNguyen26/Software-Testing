describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4173')
  })

  it('Hiển thị form đăng nhập', () => {
    cy.get('[data-testid="username-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
  })

// Test Scenario 1: Đăng nhập thành công với thông tin hợp lệ
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

// Test Scenario 2: Nhập vào username rỗng
  it('Hiển thị lỗi khi username rỗng', () => {
    cy.get('[data-testid="username-input"]').clear()
    cy.get('[data-testid="password-input"]').clear().type('Admin123')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Username is required'
    )
  })

// Test Scenario 3: Nhập vào password rỗng
  it('Hiển thị lỗi khi password rỗng', () => {
    cy.get('[data-testid="username-input"]').clear().type('admin')
    cy.get('[data-testid="password-input"]').clear()
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Password is required'
    )
  })

// Test Scenario 4: Nhập vào username không tồn tại
  it('Hiển thị lỗi khi username không tồn tại', () => {
    cy.get('[data-testid="username-input"]').clear().type('nonexistentuser')
    cy.get('[data-testid="password-input"]').clear().type('SomePassword123')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Username does not exist'
    )
  })

// Test Scenario 5: Nhập vào username quá ngắn
  it('Hiển thị lỗi khi username quá ngắn', () => {
    cy.get('[data-testid="username-input"]').clear().type('ad')
    cy.get('[data-testid="password-input"]').clear().type('SomePassword123')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Username must be at least 6 characters long'
    )
  })

// Test Scenario 6: Nhập vào username quá dài
  it('Hiển thị lỗi khi username quá dài', () => {
    cy.get('[data-testid="username-input"]')
      .clear().type('averyveryveryveryveryveryveryveryveryveryveryveryveryveryverylongusername')
    cy.get('[data-testid="password-input"]').clear().type('SomePassword123')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Username must be at most 50 characters long'
    )
  })

// Test Scenario 8: username chứa ký tự đặc biệt hoặc khoảng trắng
  it('Hiển thị lỗi khi username chứa ký tự đặc biệt hoặc khoảng trắng', () => {
    cy.get('[data-testid="username-input"]').clear().type('@invalid user!')
    cy.get('[data-testid="password-input"]').clear().type('SomePassword123')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Username can only contain letters and numbers'
    )
  })

// Test Scenario 9: password quá ngắn
  it('Hiển thị lỗi khi password quá ngắn', () => {
    cy.get('[data-testid="username-input"]').clear().type('validuser')
    cy.get('[data-testid="password-input"]').clear().type('a')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should(
      'contain.text',
      'Password must be at least 6 characters long'
    )
  })


// Test Scenario 10: Đăng nhập fail
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

// Test Scenerio 11: Username / mật khẩu chứa khoảng trắng ở đầu hoặc cuối - tự động trim và đăng nhập thành công
  it('Tự động trim khoảng trắng và đăng nhập thành công', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token' },
    }).as('loginRequest')

    cy.get('[data-testid="username-input"]').clear().type(' admin ')
    cy.get('[data-testid="password-input"]').clear().type(' Admin123 ')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@loginRequest', { timeout: 10000 })
      .its('response.statusCode')
      .should('eq', 200)

    cy.get('[data-testid="login-error"]').should('not.exist')
  })
})

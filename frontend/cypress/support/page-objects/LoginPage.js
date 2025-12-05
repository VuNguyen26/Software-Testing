// Page Object Model for Login Page
class LoginPage {
  // Selectors
  get usernameInput() {
    return cy.get('[data-testid="username-input"]')
  }

  get passwordInput() {
    return cy.get('[data-testid="password-input"]')
  }

  get loginButton() {
    return cy.get('[data-testid="login-button"]')
  }

  get loginError() {
    return cy.get('[data-testid="login-error"]')
  }

  // Actions
  visit() {
    cy.visit('/')
  }

  fillUsername(username) {
    this.usernameInput.clear().type(username)
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password)
  }

  clearUsername() {
    this.usernameInput.clear()
  }

  clearPassword() {
    this.passwordInput.clear()
  }

  clickLogin() {
    this.loginButton.click()
  }

  login(username, password) {
    this.fillUsername(username)
    this.fillPassword(password)
    this.clickLogin()
  }

  // Assertions
  verifyUsernameVisible() {
    this.usernameInput.should('be.visible')
  }

  verifyPasswordVisible() {
    this.passwordInput.should('be.visible')
  }

  verifyLoginButtonVisible() {
    this.loginButton.should('be.visible')
  }

  verifyErrorVisible() {
    this.loginError.should('be.visible')
  }

  verifyErrorMessage(message) {
    this.loginError.should('contain.text', message)
  }

  verifyErrorNotExist() {
    this.loginError.should('not.exist')
  }

  verifyRedirectToProducts() {
    cy.url().should('include', '/products')
  }

  // API Intercepts
  interceptLoginSuccess() {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token-123', user: { name: 'Admin' } },
    }).as('loginRequest')
  }

  interceptLoginFailure() {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { message: 'Username does not exist' }
    }).as('loginFailed')
  }

  waitForLoginRequest() {
    return cy.wait('@loginRequest', { timeout: 10000 })
  }

  waitForLoginFailure() {
    return cy.wait('@loginFailed', { timeout: 5000 })
  }
}

export default LoginPage

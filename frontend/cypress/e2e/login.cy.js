import LoginPage from '../support/page-objects/LoginPage'

describe('Login E2E Tests', () => {
  const loginPage = new LoginPage()

  beforeEach(() => {
    loginPage.visit()
  })

  // --- YÊU CẦU D: Test UI Elements ---
  it('Hiển thị form đăng nhập đầy đủ', () => {
    loginPage.verifyUsernameVisible()
    loginPage.verifyPasswordVisible()
    loginPage.verifyLoginButtonVisible()
  })

// Test Scenario 1: Đăng nhập thành công với thông tin hợp lệ
  it('Đăng nhập thành công với thông tin hợp lệ', () => {
    loginPage.interceptLoginSuccess()
    loginPage.login('admin', 'Admin123')
    
    loginPage.waitForLoginRequest()
      .its('response.statusCode')
      .should('eq', 200)
    
    loginPage.verifyRedirectToProducts()
  })

// Test Scenario 2: Nhập vào username rỗng
  it('Hiển thị lỗi khi username rỗng', () => {
    loginPage.clearUsername()
    loginPage.fillPassword('Admin123')
    loginPage.clickLogin()
    
    loginPage.verifyErrorVisible()
    loginPage.verifyErrorMessage('Username is required')
  })

  // Test Scenario 3: Nhập vào password rỗng
  it('Hiển thị lỗi khi password rỗng', () => {
    loginPage.fillUsername('admin')
    loginPage.clearPassword()
    loginPage.clickLogin()
    
    loginPage.verifyErrorVisible()
    loginPage.verifyErrorMessage('Password is required')
  })

  // Test Scenario 4: Nhập vào username không tồn tại
  it('Hiển thị lỗi khi username không tồn tại', () => {
    loginPage.interceptLoginFailure()
    loginPage.login('nonexistentuser', 'SomePassword123')
    
    loginPage.waitForLoginFailure()
    loginPage.verifyErrorVisible()
  })

  // Test Scenario 5: Nhập vào username quá ngắn
  it('Hiển thị lỗi khi username quá ngắn', () => {
    loginPage.login('ad', 'SomePassword123')
    
    loginPage.verifyErrorVisible()
    loginPage.verifyErrorMessage('Username must be at least 3 characters')
  })

  // Test Scenario 6: Nhập vào username quá dài
  it('Hiển thị lỗi khi username quá dài', () => {
    loginPage.login('averyveryveryveryveryveryveryveryveryveryveryveryveryveryverylongusername', 'SomePassword123')
    
    loginPage.verifyErrorVisible()
    loginPage.verifyErrorMessage('Username must be ≤ 50 characters')
  })

  // Test Scenario 8: username chứa ký tự đặc biệt hoặc khoảng trắng
  it('Hiển thị lỗi khi username chứa ký tự đặc biệt hoặc khoảng trắng', () => {
    loginPage.login('@invalid user!', 'SomePassword123')
    
    loginPage.verifyErrorVisible()
    loginPage.verifyErrorMessage('Username contains invalid characters')
  })

  // Test Scenario 9: password quá ngắn
  it('Hiển thị lỗi khi password quá ngắn', () => {
    loginPage.login('validuser', 'a')
    
    loginPage.verifyErrorVisible()
    loginPage.verifyErrorMessage('Password must be ≥ 6 characters')
  })

  // Test Scenario 10: Đăng nhập fail
  it('Hiển thị lỗi khi nhập sai thông tin', () => {
    loginPage.login('wronguser', 'wrongpass')
    
    loginPage.verifyErrorVisible()
    loginPage.verifyErrorMessage('Password must include both letters and numbers')
  })

  // Test Scenario 11: Username / mật khẩu chứa khoảng trắng ở đầu hoặc cuối - tự động trim và đăng nhập thành công
  it('Tự động trim khoảng trắng và đăng nhập thành công', () => {
    loginPage.interceptLoginSuccess()
    loginPage.fillUsername(' admin ')
    loginPage.fillPassword(' Admin123 ')
    loginPage.clickLogin()
    
    loginPage.waitForLoginRequest()
      .its('response.statusCode')
      .should('eq', 200)
    
    loginPage.verifyErrorNotExist()
  })
})

// Page Object Model for Product Page
class ProductPage {
  // Selectors
  get addProductButton() {
    return cy.get('[data-testid="add-product-button"]')
  }

  get productList() {
    return cy.get('[data-testid="product-list"]')
  }

  get productItems() {
    return cy.get('[data-testid="product-item"]')
  }

  get productNameInput() {
    return cy.get('[data-testid="product-name-input"]')
  }

  get productQuantityInput() {
    return cy.get('[data-testid="product-quantity-input"]')
  }

  get productPriceInput() {
    return cy.get('[data-testid="product-price-input"]')
  }

  get productDescriptionInput() {
    return cy.get('[data-testid="product-description-input"]')
  }

  get productCategoryInput() {
    return cy.get('[data-testid="product-category-input"]')
  }

  get saveProductButton() {
    return cy.get('[data-testid="save-product-button"]')
  }

  get validationError() {
    return cy.get('[data-testid="validation-error"]')
  }

  get notification() {
    return cy.get('[data-testid="notification"]')
  }

  getEditButton() {
    return cy.get('[data-testid="edit-product-button"]')
  }

  getDeleteButton() {
    return cy.get('[data-testid="delete-product-button"]')
  }

  // Actions
  visit() {
    cy.visit('/')
  }

  clickAddProduct() {
    this.addProductButton.click()
  }

  fillProductName(name) {
    this.productNameInput.clear().type(name)
  }

  fillProductQuantity(quantity) {
    this.productQuantityInput.type(quantity)
  }

  fillProductPrice(price) {
    this.productPriceInput.type(price)
  }

  clearProductPrice() {
    this.productPriceInput.clear()
  }

  fillProductDescription(description) {
    this.productDescriptionInput.clear().type(description)
  }

  selectProductCategory(category) {
    this.productCategoryInput.select(category)
  }

  clickSaveProduct() {
    this.saveProductButton.click()
  }

  clearProductName() {
    this.productNameInput.clear()
  }

  addProduct(name, quantity, price, description, category) {
    this.fillProductName(name)
    this.fillProductQuantity(quantity)
    this.fillProductPrice(price)
    this.fillProductDescription(description)
    this.selectProductCategory(category)
    this.clickSaveProduct()
  }

  clickEditFirstProduct() {
    this.productItems.first().within(() => {
      this.getEditButton().click()
    })
  }

  clickDeleteFirstProduct() {
    this.productItems.first().within(() => {
      this.getDeleteButton().click()
    })
    cy.on('window:confirm', () => true)
  }

  // Assertions
  verifyProductListVisible() {
    this.productList.should('be.visible')
  }

  verifyProductItemsCount(count) {
    this.productItems.its('length').should('be.gte', count)
  }

  verifyValidationErrorExists() {
    this.validationError.should('exist')
  }

  verifyValidationErrorNotExist() {
    this.validationError.should('not.exist')
  }

  verifyUrlIncludesProductsNew() {
    cy.url().should('include', '/products/new')
  }

  verifyUrlIncludesProducts() {
    cy.url().should('include', '/products')
  }

  verifyProductNameValue(name) {
    this.productNameInput.should('have.value', name)
  }

  // API Intercepts
  interceptGetProducts(products) {
    cy.intercept('GET', '**/api/products', {
      statusCode: 200,
      body: products
    }).as('getProducts')
  }

  interceptCreateProduct(product) {
    cy.intercept('POST', '**/api/products', {
      statusCode: 201,
      body: product
    }).as('createProduct')
  }

  interceptUpdateProduct(productId, product) {
    cy.intercept('PUT', `**/api/products/${productId}`, {
      statusCode: 200,
      body: product
    }).as('updateProduct')
  }

  interceptDeleteProduct(productId) {
    cy.intercept('DELETE', `**/api/products/${productId}`, {
      statusCode: 200,
      body: { id: productId }
    }).as('deleteProduct')
  }

  interceptGetProductById(productId, product) {
    cy.intercept('GET', `**/api/products/${productId}`, {
      statusCode: 200,
      body: product
    }).as('getProduct')
  }

  interceptLogin() {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token-123', user: { name: 'Admin' } }
    }).as('loginRequest')
  }

  // Wait methods
  waitForGetProducts() {
    return cy.wait('@getProducts', { timeout: 5000 })
  }

  waitForCreateProduct() {
    return cy.wait('@createProduct', { timeout: 5000 })
  }

  waitForUpdateProduct() {
    return cy.wait('@updateProduct', { timeout: 5000 })
  }

  waitForDeleteProduct() {
    return cy.wait('@deleteProduct', { timeout: 5000 })
  }

  waitForGetProduct() {
    return cy.wait('@getProduct', { timeout: 5000 })
  }

  waitForLogin() {
    return cy.wait('@loginRequest', { timeout: 5000 })
  }

  // Additional helper methods
  clearAndTypeProductName(name) {
    this.productNameInput.clear().type(name)
  }

  clearAndTypeProductPrice(price) {
    this.productPriceInput.clear().type(price)
  }

  typeProductPrice(price) {
    this.productPriceInput.type(price)
  }

  verifyProductItemsExist() {
    this.productItems.its('length').should('be.gte', 1)
  }

  verifyNoValidationError() {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="validation-error"]').length > 0) {
        throw new Error('Validation error should not exist')
      }
    })
  }

  // Search functionality
  get searchInput() {
    return cy.get('[data-testid="search-input"]')
  }

  searchProduct(searchTerm) {
    this.searchInput.clear().type(searchTerm)
  }

  clearSearch() {
    this.searchInput.clear()
  }

  verifyProductItemsCountEquals(count) {
    this.productItems.should('have.length', count)
  }

  verifyProductContainsName(name) {
    this.productItems.should('contain', name)
  }

  verifyProductDoesNotContainName(name) {
    this.productItems.should('not.contain', name)
  }

  // Login helper for beforeEach
  loginAsAdmin() {
    cy.get('[data-testid="username-input"]').clear().type('admin')
    cy.get('[data-testid="password-input"]').clear().type('Admin123')
    cy.get('[data-testid="login-button"]').click()
    this.waitForLogin()
    cy.get('[data-testid="login-error"]').should('not.exist')
  }
}

export default ProductPage

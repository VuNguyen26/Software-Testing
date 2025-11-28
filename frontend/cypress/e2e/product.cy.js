describe('Product E2E Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173')
        cy.get('[data-testid="username-input"]').clear().type('admin')
        cy.get('[data-testid="password-input"]').clear().type('Admin123')
        cy.get('[data-testid="login-button"]').click()
        cy.get('[data-testid="login-error"]').should('not.exist')
    })

    // Test Scenario 1: Thêm / xóa / sửa sản phẩm mới
    it('should add a new product', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').type('New Product')
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-price-input"]').type('99.99')
        cy.get('[data-testid="product-description-input"]').type('This is a new product.')
        cy.get('[data-testid="product-category-input"]').select('ELECTRONIC')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="product-list"]').should('contain', 'New Product')
    })

    it('should delete a product', () => {
        cy.get('[data-testid="product-item"]').contains('New Product').parent().find('[data-testid="delete-product-button"]').click()
        cy.get('[data-testid="product-list"]').should('not.contain', 'New Product')
    })

    it('should edit a product', () => {
        cy.get('[data-testid="product-item"]').first().parent().find('[data-testid="edit-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('Updated Product Name')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="product-list"]').should('contain', 'Updated Product Name')
    })

    // Test Scenario 2: Hiển thị danh sách sản phẩm
    it('should display the product list', () => {
        cy.get('[data-testid="product-list"]').should('be.visible')
        cy.get('[data-testid="product-item"]').its('length').should('be.gte', 1)
    })

    // Test Scenario 3: Thêm sản phẩm mới với thông tin không hợp lệ
    it('should show validation errors when adding a product with invalid data', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('Test Product')
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-price-input"]').type('0')
        cy.get('[data-testid="product-description-input"]').type('This is a new product.')
        cy.get('[data-testid="product-category-input"]').select('ELECTRONIC')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]').should('contain', 'Price must be a positive number')
    })

    // Test Scenario 4: Sửa sản phẩm với thông tin không hợp lệ
    it('should show validation errors when editing a product with invalid data', () => {
        cy.get('[data-testid="product-item"]').first().parent().find('[data-testid="edit-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('Updated Product')
        cy.get('[data-testid="product-price-input"]').clear().type('0')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]').should('contain', 'Price must be a positive number')
    })

    // Test Scenario 5: Tên sản phẩm để trống khi thêm / sửa
    it('should show validation errors when product name is empty', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear()
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]').should('contain', 'Product name is required')
    })

    // Test Scenario 6: Tên sản phẩm quá ngắn
    it('should show validation errors when product name is too short', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('AB')
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-description-input"]').type('This is a new product.')
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="product-category-input"]').select('ELECTRONIC')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]').should('contain', 'Product name must be at least 3 characters long')
    })

    // Test Scenario 7: Tên sản phẩm quá dài
    it('should show validation errors when product name is too long', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('A'.repeat(101))
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-description-input"]').type('This is a new product.')
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="product-category-input"]').select('ELECTRONIC')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]').should('contain', 'Product name must not exceed 100 characters')
    })

    // Test Scenario 8: Descroiption sản phẩm quá dài
    it('should show validation errors when product description is too long', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('Valid Name')
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-category-input"]').select('ELECTRONIC')
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="product-description-input"]').clear().type('D'.repeat(501))
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]').should('contain', 'Product description must not exceed 500 characters')
    })

    // Test Scenario 9: invalid category
    it('should show validation errors when product category is invalid', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('Valid Name')
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="product-description-input"]').type('This is a new product.')
        cy.get('[data-testid="product-category-input"]').select('INVALID_CATEGORY')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]').should('contain', 'Invalid product category')
    })

    // Test Scenario 10: Sửa sản phẩm không thay đổi gì
    it('should not change product when editing without modifications', () => {
        cy.get('[data-testid="product-item"]').first().parent().find('[data-testid="edit-product-button"]').click()
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="notification"]').should('contain', 'No changes made to the product')
    })

})
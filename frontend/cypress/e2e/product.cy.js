describe('Product E2E Tests', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/products', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' },
                { id: 2, name: 'Product 2', quantity: 10, price: 49.99, description: 'Second product', category: 'ELECTRONICS' },
            ]
        }).as('initialGetProducts')
        
        cy.intercept('POST', '**/api/auth/login', {
            statusCode: 200,
            body: { token: 'fake-token-123', user: { name: 'Admin' } },
        }).as('loginRequest')
        
        cy.visit('http://localhost:5173')
        cy.get('[data-testid="username-input"]').clear().type('admin')
        cy.get('[data-testid="password-input"]').clear().type('Admin123')
        cy.get('[data-testid="login-button"]').click()
        cy.wait('@loginRequest', { timeout: 5000 })
        cy.get('[data-testid="login-error"]').should('not.exist')
        cy.wait('@initialGetProducts', { timeout: 5000 })
    })

    // Test Scenario 1: Thêm / xóa / sửa sản phẩm mới
    it('should add a new product', () => {
        cy.intercept('POST', '**/api/products', {
            statusCode: 201,
            body: { id: 999, name: 'New Product', quantity: 10, price: 99.99, description: 'This is a new product.', category: 'SPORT' },
        }).as('createProduct')
        
        cy.get('[data-testid="add-product-button"]').click()
        cy.url().should('include', '/products/new')
        cy.get('[data-testid="product-name-input"]').type('New Product')
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-price-input"]').type('99.99')
        cy.get('[data-testid="product-description-input"]').type('This is a new product.')
        cy.get('[data-testid="product-category-input"]').select('SPORT')
        cy.get('[data-testid="save-product-button"]').click()
        
        cy.wait('@createProduct', { timeout: 5000 })
        cy.url().should('include', '/products')
    })

    it('should delete a product', () => {
        cy.intercept('DELETE', '**/api/products/**', {
            statusCode: 200,
            body: { id: 1 }
        }).as('deleteProduct')
        
        cy.intercept('GET', '**/api/products', {
            statusCode: 200,
            body: [
                { id: 2, name: 'Product 2', quantity: 10, price: 49.99, description: 'Second product', category: 'ELECTRONICS' },
            ]
        }).as('getProductsAfterDelete')
        
        cy.get('table [data-testid="product-item"]').first().within(() => {
            cy.get('[data-testid="delete-product-button"]').click()
        })
        cy.on('window:confirm', () => true)
        
        cy.wait('@deleteProduct', { timeout: 5000 })
    })

    it('should edit a product', () => {
        cy.intercept('GET', '**/api/products/1', {
            statusCode: 200,
            body: { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' }
        }).as('getProduct')
        
        cy.intercept('PUT', '**/api/products/1', {
            statusCode: 200,
            body: { id: 1, name: 'Updated Product Name', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' },
        }).as('updateProduct')
        
        cy.intercept('GET', '**/api/products', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Updated Product Name', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' }
            ]
        }).as('getProductsAfterUpdate')
        
        cy.get('[data-testid="product-item"]').first().within(() => {
            cy.get('[data-testid="edit-product-button"]').click()
        })
        cy.wait('@getProduct', { timeout: 5000 })
        cy.get('[data-testid="product-name-input"]').clear().type('Updated Product Name')
        cy.get('[data-testid="save-product-button"]').click()
        
        cy.wait('@updateProduct', { timeout: 5000 })
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
        cy.get('[data-testid="product-category-input"]').select('ELECTRONICS')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]', { timeout: 8000 }).should('exist')
    })

    // Test Scenario 4: Sửa sản phẩm với thông tin không hợp lệ
    it('should show validation errors when editing a product with invalid data', () => {
        cy.intercept('GET', '**/api/products/1', {
            statusCode: 200,
            body: { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' }
        }).as('getProduct')
        
        cy.get('[data-testid="product-item"]').first().within(() => {
            cy.get('[data-testid="edit-product-button"]').click()
        })
        cy.wait('@getProduct', { timeout: 5000 })
        cy.get('[data-testid="product-name-input"]').clear().type('Updated Product')
        cy.get('[data-testid="product-price-input"]').clear().type('0')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]', { timeout: 8000 }).should('exist')
    })

    // Test Scenario 5: Tên sản phẩm để trống khi thêm / sửa
    it('should show validation errors when product name is empty', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear()
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]', { timeout: 8000 }).should('exist')
    })

    // Test Scenario 6: Tên sản phẩm quá ngắn
    it('should show validation errors when product name is too short', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('AB')
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-description-input"]').type('This is a new product.')
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="product-category-input"]').select('SPORT')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]', { timeout: 8000 }).should('exist')
    })

    // Test Scenario 7: Tên sản phẩm quá dài
    it('should show validation errors when product name is too long', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('A'.repeat(101))
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-description-input"]').type('This is a new product.')
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="product-category-input"]').select('ELECTRONICS')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]', { timeout: 8000 }).should('exist')
    })

    // Test Scenario 8: Descroiption sản phẩm quá dài
    it('should show validation errors when product description is too long', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('Valid Name')
        cy.get('[data-testid="product-quantity-input"]').type('10')
        cy.get('[data-testid="product-category-input"]').select('ELECTRONICS')
        cy.get('[data-testid="product-price-input"]').type('50')
        cy.get('[data-testid="product-description-input"]').clear().type('D'.repeat(501))
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]', { timeout: 8000 }).should('exist')
    })

    // Test Scenario 9: Add product with price exceeding max limit
    it('should show validation errors when product price exceeds max limit', () => {
        cy.get('[data-testid="add-product-button"]').click()
        cy.get('[data-testid="product-name-input"]').clear().type('Expensive Product')
        cy.get('[data-testid="product-quantity-input"]').type('5')
        cy.get('[data-testid="product-price-input"]').type('9999999999')
        cy.get('[data-testid="product-description-input"]').type('This is an expensive product.')
        cy.get('[data-testid="product-category-input"]').select('ELECTRONICS')
        cy.get('[data-testid="save-product-button"]').click()
        cy.get('[data-testid="validation-error"]', { timeout: 8000 }).should('exist')
    })

    // Test Scenario 10: Sửa sản phẩm không thay đổi gì
    it('should not change product when editing without modifications', () => {
        cy.intercept('GET', '**/api/products/1', {
            statusCode: 200,
            body: { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' }
        }).as('getProduct')
        
        cy.get('[data-testid="product-item"]').first().within(() => {
            cy.get('[data-testid="edit-product-button"]').click()
        })
        cy.wait('@getProduct', { timeout: 5000 })
        cy.get('[data-testid="product-name-input"]').should('have.value', 'Product 1')
        cy.get('[data-testid="save-product-button"]').click()
        // Just verify we're still on the form or check that no error occurred
        cy.get('[data-testid="validation-error"]').should('not.exist')
    })

})
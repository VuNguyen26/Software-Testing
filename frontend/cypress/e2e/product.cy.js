import ProductPage from '../support/page-objects/ProductPage'

describe('Product E2E Tests', () => {
    const productPage = new ProductPage()
    
    beforeEach(() => {
        productPage.interceptGetProducts([
            { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' },
            { id: 2, name: 'Product 2', quantity: 10, price: 49.99, description: 'Second product', category: 'ELECTRONICS' },
        ])
        
        productPage.interceptLogin()
        
        productPage.visit()
        productPage.loginAsAdmin()
        productPage.waitForGetProducts()
    })

    // Test Scenario 1: Thêm / xóa / sửa sản phẩm mới
    it('should add a new product', () => {
        productPage.interceptCreateProduct({ 
            id: 999, 
            name: 'New Product', 
            quantity: 10, 
            price: 99.99, 
            description: 'This is a new product.', 
            category: 'SPORT' 
        })
        
        productPage.clickAddProduct()
        productPage.verifyUrlIncludesProductsNew()
        productPage.addProduct('New Product', '10', '99.99', 'This is a new product.', 'SPORT')
        
        productPage.waitForCreateProduct()
        productPage.verifyUrlIncludesProducts()
    })

    it('should delete a product', () => {
        cy.intercept('DELETE', '**/api/products/**', {
            statusCode: 200,
            body: {}
        }).as('deleteProduct')
        
        productPage.interceptGetProducts([
            { id: 2, name: 'Product 2', quantity: 10, price: 49.99, description: 'Second product', category: 'ELECTRONICS' },
        ])
        
        productPage.clickDeleteFirstProduct()
        
        cy.wait('@deleteProduct', { timeout: 5000 })
    })

    it('should edit a product', () => {
        productPage.interceptGetProductById(1, { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' })
        
        productPage.interceptUpdateProduct(1, { id: 1, name: 'Updated Product Name', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' })
        
        productPage.interceptGetProducts([
            { id: 1, name: 'Updated Product Name', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' }
        ])
        
        productPage.clickEditFirstProduct()
        productPage.waitForGetProduct()
        productPage.clearAndTypeProductName('Updated Product Name')
        productPage.clickSaveProduct()
        
        productPage.waitForUpdateProduct()
    })

    // Test Scenario 2: Hiển thị danh sách sản phẩm
    it('should display the product list', () => {
        productPage.verifyProductListVisible()
        productPage.verifyProductItemsExist()
    })

    // Test Scenario 3: Thêm sản phẩm mới với thông tin không hợp lệ
    it('should show validation errors when adding a product with invalid data', () => {
        productPage.clickAddProduct()
        productPage.addProduct('Test Product', '10', '0', 'This is a new product.', 'ELECTRONICS')
        productPage.verifyValidationErrorExists()
    })

    // Test Scenario 4: Sửa sản phẩm với thông tin không hợp lệ
    it('should show validation errors when editing a product with invalid data', () => {
        productPage.interceptGetProductById(1, { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' })
        
        productPage.clickEditFirstProduct()
        productPage.waitForGetProduct()
        productPage.clearAndTypeProductName('Updated Product')
        productPage.clearAndTypeProductPrice('0')
        productPage.clickSaveProduct()
        productPage.verifyValidationErrorExists()
    })

    // Test Scenario 5: Tên sản phẩm để trống khi thêm / sửa
    it('should show validation errors when product name is empty', () => {
        productPage.clickAddProduct()
        productPage.clearProductName()
        productPage.typeProductPrice('50')
        productPage.clickSaveProduct()
        productPage.verifyValidationErrorExists()
    })

    // Test Scenario 6: Tên sản phẩm quá ngắn
    it('should show validation errors when product name is too short', () => {
        productPage.clickAddProduct()
        productPage.addProduct('AB', '10', '50', 'This is a new product.', 'SPORT')
        productPage.verifyValidationErrorExists()
    })

    // Test Scenario 7: Tên sản phẩm quá dài
    it('should show validation errors when product name is too long', () => {
        productPage.clickAddProduct()
        productPage.addProduct('A'.repeat(101), '10', '50', 'This is a new product.', 'ELECTRONICS')
        productPage.verifyValidationErrorExists()
    })

    // Test Scenario 8: Descroiption sản phẩm quá dài
    it('should show validation errors when product description is too long', () => {
        productPage.clickAddProduct()
        productPage.addProduct('Valid Name', '10', '50', 'D'.repeat(501), 'ELECTRONICS')
        productPage.verifyValidationErrorExists()
    })

    // Test Scenario 9: Add product with price exceeding max limit
    it('should show validation errors when product price exceeds max limit', () => {
        productPage.clickAddProduct()
        productPage.addProduct('Expensive Product', '5', '9999999999', 'This is an expensive product.', 'ELECTRONICS')
        productPage.verifyValidationErrorExists()
    })

    // Test Scenario 10: Sửa sản phẩm không thay đổi gì
    it('should not change product when editing without modifications', () => {
        productPage.interceptGetProductById(1, { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' })
        
        productPage.interceptUpdateProduct(1, { id: 1, name: 'Product 1', quantity: 5, price: 29.99, description: 'First product', category: 'SPORT' })
        
        productPage.clickEditFirstProduct()
        productPage.waitForGetProduct()
        productPage.verifyProductNameValue('Product 1')
        productPage.clickSaveProduct()
        productPage.waitForUpdateProduct()
        productPage.verifyUrlIncludesProducts()
    })

    // Test Scenario 11: Tìm kiếm sản phẩm theo tên
    it('should filter products when searching by name', () => {
        productPage.searchProduct('Product 1')
        productPage.verifyProductItemsCountEquals(1)
        productPage.verifyProductContainsName('Product 1')
        productPage.verifyProductDoesNotContainName('Product 2')
    })

    // Test Scenario 12: Tìm kiếm sản phẩm không tồn tại
    it('should show no products when searching for non-existent product', () => {
        productPage.searchProduct('NonExistentProduct')
        productPage.verifyProductItemsCountEquals(0)
    })

})
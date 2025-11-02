/**
 * @file productValidation.test.js
 * @description Unit Test cho Product Validation (Frontend)
 * Framework: Jest + React Testing Library
 */

import { validateProduct } from './validateProduct'

describe('PRODUCT VALIDATION TESTS', () => {
  test('TC01: Name rỗng → lỗi', () => {
    const p = { name: '', price: 1000, quantity: 10 }
    const e = validateProduct(p)
    expect(e.name).toBe('Product name is required')
  })

  test('TC02: Price <= 0 → lỗi', () => {
    const p = { name: 'Laptop', price: 0, quantity: 1 }
    const e = validateProduct(p)
    expect(e.price).toBe('Price must be greater than 0')
  })

  test('TC03: Quantity < 0 → lỗi', () => {
    const p = { name: 'Laptop', price: 1000, quantity: -1 }
    const e = validateProduct(p)
    expect(e.quantity).toBe('Quantity cannot be negative')
  })

  test('TC04: Description quá 500 ký tự → lỗi', () => {
    const p = { name: 'Laptop', price: 1000, quantity: 1, description: 'x'.repeat(501) }
    const e = validateProduct(p)
    expect(e.description).toBe('Description too long')
  })

  test('TC05: Category không hợp lệ → lỗi', () => {
    const p = { name: 'Laptop', price: 1000, quantity: 1, category: 'Unknown' }
    const e = validateProduct(p)
    expect(e.category).toBe('Invalid category')
  })

  test('TC06: Dữ liệu hợp lệ → không lỗi', () => {
    const p = { name: 'Laptop Dell', price: 15000000, quantity: 10, category: 'Electronics' }
    const e = validateProduct(p)
    expect(Object.keys(e).length).toBe(0)
  })
})

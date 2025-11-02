/**
 * @file validation.test.js
 * @description Unit Test cho chức năng LOGIN (Frontend)
 * Framework: Jest + React Testing Library
 */

import { validateUsername, validatePassword } from './validateLogin'

describe('LOGIN VALIDATION TESTS', () => {
  // ===== Username =====
  test('TC01: Username rỗng → trả về lỗi', () => {
    expect(validateUsername('')).toBe('Username is required')
  })

  test('TC02: Username quá ngắn (<3 ký tự) → lỗi', () => {
    expect(validateUsername('ab')).toBe('Username must be at least 3 characters')
  })

  test('TC03: Username quá dài (>50 ký tự) → lỗi', () => {
    expect(validateUsername('a'.repeat(51))).toBe('Username must be ≤ 50 characters')
  })

  test('TC04: Username chứa ký tự đặc biệt → lỗi', () => {
    expect(validateUsername('user@name')).toBe('Username contains invalid characters')
  })

  test('TC05: Username hợp lệ → không lỗi', () => {
    expect(validateUsername('user_name.123')).toBe('')
  })

  // ===== Password =====
  test('TC06: Password rỗng → lỗi', () => {
    expect(validatePassword('')).toBe('Password is required')
  })

  test('TC07: Password quá ngắn (<6 ký tự) → lỗi', () => {
    expect(validatePassword('A1b')).toBe('Password must be ≥ 6 characters')
  })

  test('TC08: Password quá dài (>100 ký tự) → lỗi', () => {
    expect(validatePassword('A1'.repeat(60))).toBe('Password must be ≤ 100 characters')
  })

  test('TC09: Password không có số → lỗi', () => {
    expect(validatePassword('Abcdef')).toBe('Password must include both letters and numbers')
  })

  test('TC10: Password hợp lệ → không lỗi', () => {
    expect(validatePassword('Test123')).toBe('')
  })
})

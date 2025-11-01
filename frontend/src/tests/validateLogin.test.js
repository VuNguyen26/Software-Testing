import { describe, it, expect } from 'vitest'
import { validateUsername, validatePassword } from '../utils/validateLogin.js'

describe('validateUsername', () => {
  it('accepts valid', () => {
    expect(validateUsername('john_doe')).toBe(true)
  })
  it('rejects short', () => {
    expect(validateUsername('ab')).not.toBe(true)
  })
})

describe('validatePassword', () => {
  it('accepts valid', () => {
    expect(validatePassword('abc123')).toBe(true)
  })
  it('rejects missing number', () => {
    expect(validatePassword('abcdef')).not.toBe(true)
  })
})
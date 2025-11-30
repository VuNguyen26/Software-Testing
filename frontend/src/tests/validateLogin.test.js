import { describe, it, expect } from 'vitest'
import { validateUsername, validatePassword } from '../utils/validateLogin.js'

describe('validateUsername', () => {
  it('accepts valid', () => {
    expect(validateUsername('john_doe')).toBe(true)
  })
  it('rejects short', () => {
    expect(validateUsername('ab')).not.toBe(true)
  })
  it('rejects long', () => {
    expect(validateUsername('a'.repeat(51))).not.toBe(true)
  })
  it('rejects special characters', () => {
    expect(validateUsername('user@name')).not.toBe(true)
  })
  it('rejects empty', () => {
    expect(validateUsername('')).not.toBe(true)
  })
})

describe('validatePassword', () => {
  it('accepts valid', () => {
    expect(validatePassword('abc123')).toBe(true)
  })
  it('rejects missing number', () => {
    expect(validatePassword('abcdef')).not.toBe(true)
  })
  it('rejects missing letter', () => {
    expect(validatePassword('123456')).not.toBe(true)
  })
  it('rejects short', () => {
    expect(validatePassword('abc')).not.toBe(true)
  })
  it('rejects long', () => {
    expect(validatePassword('a'.repeat(101))).not.toBe(true)
  })
  it('rejects empty', () => {
    expect(validatePassword('')).not.toBe(true)
  })
})
import { describe, it, expect } from 'vitest'
import { validateProduct } from '../utils/validateProduct.js'

describe('validateProduct', () => {
  it('valid product', () => {
    const p = {name:'Ball', price: 1000, quantity:1, description:'', category:'SPORT'}
    expect(validateProduct(p)).toBe(true)
  })
  it('rejects missing name', () => {
    const p = {name:'', price: 1000, quantity:1, description:'', category:'SPORT'}
    expect(validateProduct(p)).not.toBe(true)
  })
  it('rejects negative quantity', () => {
    const p = {name:'Ball', price: 1000, quantity:-1, description:'', category:'SPORT'}
    expect(validateProduct(p)).not.toBe(true)
  })
  it('rejects price greater than 1 billion', () => {
    const p = {name:'Ball', price: 1000000001, quantity:1, description:'', category:'SPORT'}
    expect(validateProduct(p)).not.toBe(true)
  })
  it('rejects price less than 1', () => {
    const p = {name:'Ball', price: 0, quantity:1, description:'', category:'SPORT'}
    expect(validateProduct(p)).not.toBe(true)
  })
  it('rejects too long description', () => {
    const p = {name:'Ball', price: 1000, quantity:1, description:'a'.repeat(501), category:'SPORT'}
    expect(validateProduct(p)).not.toBe(true)
  })
  it('rejects invalid category', () => {
    const p = {name:'Ball', price: 1000, quantity:1, description:'', category:'UNKNOWN'}
    expect(validateProduct(p)).not.toBe(true)
  })

})
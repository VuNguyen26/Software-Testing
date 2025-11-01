import { describe, it, expect } from 'vitest'
import { validateProduct } from '../utils/validateProduct.js'

describe('validateProduct', () => {
  it('valid product', () => {
    const p = {name:'Ball', price: 1000, quantity:1, description:'', category:'SPORT'}
    expect(validateProduct(p)).toBe(true)
  })
  it('rejects invalid price', () => {
    const p = {name:'Ball', price: 0, quantity:1, description:'', category:'SPORT'}
    expect(validateProduct(p)).not.toBe(true)
  })
})
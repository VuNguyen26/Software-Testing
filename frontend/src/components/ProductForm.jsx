import React, { useState } from 'react'
import { validateProduct } from '../utils/validateProduct.js'
import { createProduct } from '../services/productService.js'

export default function ProductForm({ token }) {
  const [form, setForm] = useState({ name:'Ball', price: 100000, quantity:10, description:'A nice ball', category:'SPORT' })
  const [msg, setMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name==='price'||name==='quantity' ? Number(value) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    const valid = validateProduct(form)
    if (valid !== true) return setMsg(valid)
    try {
      const result = await createProduct(form, token)
      setMsg(`Created product id=${result.id}`)
    } catch (err) {
      setMsg(err?.message || 'Create failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="product-form" style={{marginTop:24}}>
      <h2>Create Product</h2>

      <div>
        <label htmlFor="name">Name</label><br/>
        <input id="name" name="name" value={form.name} onChange={handleChange}/>
      </div>

      <div>
        <label htmlFor="price">Price</label><br/>
        <input id="price" name="price" type="number" value={form.price} onChange={handleChange}/>
      </div>

      <div>
        <label htmlFor="quantity">Quantity</label><br/>
        <input id="quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange}/>
      </div>

      <div>
        <label htmlFor="description">Description</label><br/>
        <input id="description" name="description" value={form.description} onChange={handleChange}/>
      </div>

      <div>
        <label htmlFor="category">Category</label><br/>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          <option>SPORT</option>
          <option>ELECTRONIC</option>
          <option>FOOD</option>
        </select>
      </div>

      {msg && (
      <p
        role={
          typeof msg === 'string' &&
          (msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('error'))
            ? 'alert'
            : 'status'
        }
      >
        {typeof msg === 'string' ? msg : JSON.stringify(msg)}
      </p>
    )}
      <button type="submit" style={{marginTop:12}}>Save</button>
    </form>
  )
}
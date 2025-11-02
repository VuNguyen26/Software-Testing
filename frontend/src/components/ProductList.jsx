import React, { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err?.message || 'Load failed'))
  }, [])

  return (
    <div aria-label="product-list">
      <h2>Products</h2>
      {error && <p role="alert">{error}</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id} data-testid="product-item">
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { getProductById } from '../services/productService'

export default function ProductDetail({ id }) {
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err?.message || 'Load failed'))
  }, [id])

  if (error) return <p role="alert">{error}</p>
  if (!product) return <p role="status">Loading...</p>

  return (
    <div aria-label="product-detail">
      <h2>{product.name}</h2>
      <p data-testid="price">{product.price}</p>
      <p data-testid="quantity">{product.quantity}</p>
      <p data-testid="category">{product.category}</p>
    </div>
  )
}

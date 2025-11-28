import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProductForm from '../components/ProductForm.jsx'
import * as svc from '../services/productService.js'

describe('ProductForm', () => {
  it('create success', async () => {
    vi.spyOn(svc, 'createProduct').mockResolvedValue({ id: 1 })
    render(
      <MemoryRouter>
        <ProductForm token="t" />
      </MemoryRouter>
    )

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Product' } })
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '150' } })
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'A great new product' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'ELECTRONICS' } })

    fireEvent.submit(screen.getByLabelText('product-form'))
    
    // Đợi và xác minh thông báo thành công xuất hiện
    const successMessage = await screen.findByRole('status')
    expect(successMessage).toHaveTextContent('Created product id=1')
  })
})
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductForm from '../components/ProductForm.jsx'
import * as svc from '../services/productService.js'

describe('ProductForm', () => {
  it('create success', async () => {
    vi.spyOn(svc, 'createProduct').mockResolvedValue({ id: 1 })
    render(<ProductForm token="t" />)
    fireEvent.submit(screen.getByLabelText('product-form'))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Created product id=1'))
  })
})
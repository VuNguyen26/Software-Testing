/**
 * ProductDetail Integration Test
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('../services/productService.js', () => ({
  getProductById: vi.fn(),
}))

import { getProductById } from '../services/productService.js'
import ProductDetail from '../components/ProductDetail.jsx'

describe('ProductDetail Integration', () => {
  afterEach(() => vi.clearAllMocks())

  test('Hiển thị chi tiết sản phẩm khi load thành công', async () => {
    getProductById.mockResolvedValueOnce({
      id: 1,
      name: 'Ball',
      price: 1000,
      quantity: 2,
      category: 'SPORT',
    })

    render(<ProductDetail id={1} />)

    await waitFor(() => {
      expect(screen.getByLabelText('product-detail')).toBeInTheDocument()
      expect(screen.getByText('Ball')).toBeInTheDocument()
      expect(screen.getByTestId('price').textContent).toBe('1000')
    })
  })

  test('Hiển thị lỗi khi API lỗi', async () => {
    getProductById.mockRejectedValueOnce(new Error('Not found'))

    render(<ProductDetail id={99} />)

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/not found/i)
    })
  })
})

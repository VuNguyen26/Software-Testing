/**
 * ProductList Integration Test
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('../services/productService.js', () => ({
  getProducts: vi.fn(),
}))

import { getProducts } from '../services/productService.js'
import ProductList from '../components/ProductList.jsx'

describe('ProductList Integration', () => {
  afterEach(() => vi.clearAllMocks())

  test('Hiển thị danh sách sản phẩm từ API', async () => {
    getProducts.mockResolvedValueOnce([
      { id: 1, name: 'Ball' },
      { id: 2, name: 'Shoes' },
    ])

    render(<ProductList />)

    await waitFor(() => {
      const items = screen.getAllByTestId('product-item')
      expect(items).toHaveLength(2)
      expect(items[0].textContent).toBe('Ball')
    })
  })

  test('Hiển thị lỗi khi API lỗi', async () => {
    getProducts.mockRejectedValueOnce(new Error('Server error'))
    render(<ProductList />)

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/server error/i)
    })
  })
})

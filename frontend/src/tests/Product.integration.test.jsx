/**
 * Câu 3 - Integration Test (Frontend)
 * ProductForm + productService
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

// Mock đúng tên export của service
vi.mock('../services/productService.js', () => ({
  createProduct: vi.fn(),
}))

import { createProduct } from '../services/productService.js'
import ProductForm from '../components/ProductForm.jsx'

describe('Product Integration', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Tạo sản phẩm thành công → gọi API đúng payload', async () => {
    // Giả lập API trả về kết quả thành công
    createProduct.mockResolvedValueOnce({
      id: 1,
      name: 'Ball',
      price: 1000,
      quantity: 1,
      category: 'SPORT',
    })

    render(<ProductForm />)

    // Nhập dữ liệu vào form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Ball' } })
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '1000' } })
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '1' } })
    const cat = screen.queryByLabelText(/category/i)
    if (cat) fireEvent.change(cat, { target: { value: 'SPORT' } })

    // Gửi form
    fireEvent.submit(screen.getByLabelText('product-form'))

    // Kiểm tra API được gọi đúng
    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledTimes(1)

      // Kiểm tra tham số đầu tiên (form)
      const [payload, token] = createProduct.mock.calls[0]
      expect(payload).toMatchObject({
        name: 'Ball',
        price: 1000,
        quantity: 1,
        description: 'A nice ball',
        category: 'SPORT',
      })

      // Kiểm tra tham số thứ hai (token) có thể là undefined
      expect(token === undefined || typeof token === 'string').toBeTruthy()
    })
  })

  test('Tạo sản phẩm lỗi → hiển thị lỗi', async () => {
    // Giả lập API ném lỗi
    createProduct.mockRejectedValueOnce(new Error('Server error'))

    render(<ProductForm />)

    // Nhập dữ liệu vào form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Ball' } })
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '1000' } })
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '1' } })

    // Gửi form
    fireEvent.submit(screen.getByLabelText('product-form'))

    // Kiểm tra hiển thị lỗi đúng dạng alert
    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toMatch(/server error/i)
    })
  })
})

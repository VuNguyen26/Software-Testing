/**
 * Integration Test
 * LoginForm + authService
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom' // 1. Import Router để tránh lỗi
import LoginForm from '../components/LoginForm.jsx'
import { login } from '../services/authService.js'

// Giả lập service (mock)
vi.mock('../services/authService.js', () => ({
  login: vi.fn(),
}))

describe('Login Integration', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Success flow: Render -> Nhập liệu -> Submit -> Gọi API đúng tham số -> Thành công', async () => {
    // Setup
    login.mockResolvedValueOnce('demo-token-admin')
    const onSuccess = vi.fn()

    // 2. Bọc Router
    render(
      <MemoryRouter>
        <LoginForm onSuccess={onSuccess} />
      </MemoryRouter>
    )

    // --- YÊU CẦU A: Test Rendering & Interactions ---
    // Kiểm tra input có hiển thị không
    const usernameInput = screen.getByLabelText(/username/i) // Hoặc getByRole('textbox')
    const passwordInput = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /login/i })

    expect(usernameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()

    // Giả lập người dùng nhập liệu (Interaction)
    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // --- YÊU CẦU B: Form Submission & API Calls ---
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1)
      // QUAN TRỌNG: Kiểm tra xem API có được gọi với đúng dữ liệu vừa nhập không
      expect(login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password123'
      })
      
      // --- YÊU CẦU C: Success Message ---
      expect(onSuccess).toHaveBeenCalledWith('demo-token-admin')
    })
  })

  test('Error flow: Nhập liệu -> Submit -> API lỗi -> Hiển thị thông báo', async () => {
    login.mockRejectedValueOnce(new Error('Invalid credentials'))
    const onSuccess = vi.fn()

    render(
      <MemoryRouter>
        <LoginForm onSuccess={onSuccess} />
      </MemoryRouter>
    )

    // Vẫn phải nhập liệu để đảm bảo quy trình đúng
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrong' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } })
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled()
      // --- YÊU CẦU C: Error Handling ---
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toMatch(/invalid credentials/i)
    })
  })
})
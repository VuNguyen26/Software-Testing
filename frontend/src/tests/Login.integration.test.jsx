/**
 * Integration Test
 * LoginForm + authService
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

// Giả lập service (mock)
vi.mock('../services/authService.js', () => ({
  login: vi.fn(),
}))

import { login } from '../services/authService.js'
import LoginForm from '../components/LoginForm.jsx'

describe('Login Integration', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Success flow → gọi service & kích hoạt onSuccess', async () => {
    login.mockResolvedValueOnce('demo-token-admin')

    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    // Submit form
    fireEvent.submit(screen.getByLabelText('login-form'))

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1)
      expect(onSuccess).toHaveBeenCalledWith('demo-token-admin')
    })
  })

  test('Error flow → hiển thị lỗi từ service', async () => {
    login.mockRejectedValueOnce(new Error('Invalid credentials'))

    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    fireEvent.submit(screen.getByLabelText('login-form'))

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled()
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toMatch(/invalid credentials/i)
    })
  })
})

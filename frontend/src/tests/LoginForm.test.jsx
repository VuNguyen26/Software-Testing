import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginForm from '../components/LoginForm.jsx'
import * as auth from '../services/authService.js'
import * as validateModule from '../utils/validateLogin.js'

// Partial mock (KHÔNG được mock toàn module)
vi.spyOn(validateModule, "validateUsername")
vi.spyOn(validateModule, "validatePassword")

describe('LoginForm - Full Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderForm = (props = {}) => render(<LoginForm onSuccess={() => {}} {...props} />)

  it('success flow: valid input → login() called → onSuccess(token)', async () => {
    validateModule.validateUsername.mockReturnValue(true)
    validateModule.validatePassword.mockReturnValue(true)
    vi.spyOn(auth, 'login').mockResolvedValue('fake-token')

    const onSuccess = vi.fn()
    renderForm({ onSuccess })

    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Admin123' } })

    fireEvent.click(screen.getByTestId('login-button'))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('fake-token'))
  })

  it('shows validation error when username is invalid', async () => {
    validateModule.validateUsername.mockReturnValue('Username too short')
    validateModule.validatePassword.mockReturnValue(true)

    renderForm()
    fireEvent.click(screen.getByTestId('login-button'))

    expect(await screen.findByTestId('login-error')).toHaveTextContent('Username too short')
  })

  it('shows validation error when password is invalid', async () => {
    validateModule.validateUsername.mockReturnValue(true)
    validateModule.validatePassword.mockReturnValue('Password too weak')

    renderForm()
    fireEvent.click(screen.getByTestId('login-button'))

    expect(await screen.findByTestId('login-error')).toHaveTextContent('Password too weak')
  })

  it('shows API error with custom message', async () => {
    validateModule.validateUsername.mockReturnValue(true)
    validateModule.validatePassword.mockReturnValue(true)

    vi.spyOn(auth, 'login').mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    })

    renderForm()
    fireEvent.click(screen.getByTestId('login-button'))

    expect(await screen.findByTestId('login-error')).toHaveTextContent('Invalid credentials')
  })

  it('shows default error when API rejects without message', async () => {
    validateModule.validateUsername.mockReturnValue(true)
    validateModule.validatePassword.mockReturnValue(true)

    vi.spyOn(auth, 'login').mockRejectedValue(new Error('Something broke'))

    renderForm()
    fireEvent.click(screen.getByTestId('login-button'))

    expect(await screen.findByTestId('login-error')).toHaveTextContent('Something broke')
  })

  it('joins multiple validation errors together', async () => {
    validateModule.validateUsername.mockReturnValue('Username bad')
    validateModule.validatePassword.mockReturnValue('Password bad')

    renderForm()
    fireEvent.click(screen.getByTestId('login-button'))

    expect(await screen.findByTestId('login-error')).toHaveTextContent('Username bad. Password bad')
  })
})

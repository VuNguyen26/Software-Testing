import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginForm from '../components/LoginForm.jsx'
import * as auth from '../services/authService.js'

describe('LoginForm', () => {
  it('success flow', async () => {
    vi.spyOn(auth, 'login').mockResolvedValue('fake-token')
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)
    fireEvent.submit(screen.getByRole('form', { hidden: true }) || screen.getByLabelText('login-form'))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('fake-token'))
  })
})
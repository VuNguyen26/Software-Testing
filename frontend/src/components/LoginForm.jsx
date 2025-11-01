import React, { useState } from 'react'
import { validateUsername, validatePassword } from '../utils/validateLogin.js'
import { login } from '../services/authService.js'

export default function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Admin123')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const u = validateUsername(username)
    const p = validatePassword(password)
    if (u !== true) return setError(u)
    if (p !== true) return setError(p)

    try {
      const token = await login({ username, password })
      onSuccess(token)
    } catch (err) {
      setError(err?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="login-form">
      <h2>Login</h2>
      <div>
        <label>Username</label><br/>
        <input value={username} onChange={e=>setUsername(e.target.value)} />
      </div>
      <div style={{marginTop: 8}}>
        <label>Password</label><br/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      {error && <p role="alert" style={{color:'red'}}>{error}</p>}
      <button type="submit" style={{marginTop:12}}>Sign in</button>
    </form>
  )
}
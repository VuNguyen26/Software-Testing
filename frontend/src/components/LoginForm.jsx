import React, { useState } from 'react';
import { validateUsername, validatePassword } from '../utils/validateLogin.js';
import { login } from '../services/authService.js';
import './LoginForm.css';

export default function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Trim whitespace from username and password
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const u = validateUsername(trimmedUsername);
    const p = validatePassword(trimmedPassword);
    // chấp nhận cả true và ''
    if (u !== true && u !== '') return setError(u);
    if (p !== true && p !== '') return setError(p);

    try {
      const token = await login({ username: trimmedUsername, password: trimmedPassword });
      onSuccess(token);
    } catch (err) {
      setError(err?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" aria-label="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="username-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
          />
        </div>
        {error && <p className="error-message" role="alert" data-testid="login-error">{error}</p>}
        <button type="submit" data-testid="login-button">Login</button>
      </form>
    </div>
  );
}


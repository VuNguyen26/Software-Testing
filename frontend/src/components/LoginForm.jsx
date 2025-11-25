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

    const validationErrors = [];
    const uError = validateUsername(username);
    if (uError !== true && uError !== '') {
      validationErrors.push(uError);
    }

    const pError = validatePassword(password);
    if (pError !== true && pError !== '') {
      validationErrors.push(pError);
    }

    if (validationErrors.length > 0) {
      return setError(validationErrors.join('. '));
    }

    try {
      const token = await login({ username, password });
      if (token) {
        onSuccess(token);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Invalid credentials');
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


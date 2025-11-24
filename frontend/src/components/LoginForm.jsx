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

    const uError = validateUsername(username);
    if (uError !== true && uError !== '') {
      return setError(uError);
    }

    const pError = validatePassword(password);
    if (pError !== true && pError !== '') {
      return setError(pError);
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
          />
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}


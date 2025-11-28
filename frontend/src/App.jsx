import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm.jsx';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // If there's no token, the user can only access the login page.
  // All other paths redirect to /login.
  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm onSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // If there is a token, the user is authenticated.
  return (
    <BrowserRouter>
      <Routes>
        {/* If an authenticated user tries to go to /login, redirect them to the dashboard */}
        <Route path="/login" element={<Navigate to="/" />} />

        {/* The main dashboard layout */}
        <Route path="/" element={<DashboardLayout handleLogout={handleLogout} />}>
          <Route index element={<Navigate to="/products" />} />
          <Route path="products" element={<ProductList token={token} />} />
          <Route path="products/new" element={<ProductForm token={token} />} />
          <Route path="products/:id/edit" element={<ProductForm token={token} />} />
          {/* Catch-all for any other authenticated paths, redirects to the products list */}
          <Route path="*" element={<Navigate to="/products" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
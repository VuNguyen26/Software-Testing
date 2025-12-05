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

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Navigate to="/" />} />

        <Route path="/" element={<DashboardLayout handleLogout={handleLogout} />}>

          <Route index element={<Navigate to="/products" />} />

          {/* KHÔNG TRUYỀN TOKEN QUA PROPS */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />

          <Route path="*" element={<Navigate to="/products" />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

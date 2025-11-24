import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateProduct } from '../utils/validateProduct.js';
import { createProduct, getProductById, updateProduct } from '../services/productService.js';
import './ProductForm.css';

export default function ProductForm({ token }) {
  const [form, setForm] = useState({ name: '', price: 0, quantity: 0, description: '', category: 'SPORT' });
  const [msg, setMsg] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      getProductById(id, token)
        .then(product => setForm(product))
        .catch(err => setMsg(err?.message || 'Failed to load product data'));
    }
  }, [id, isEditMode, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'price' || name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const valid = validateProduct(form);
    if (valid !== true) return setMsg(valid);
    try {
      if (isEditMode) {
        await updateProduct(id, form, token);
      } else {
        await createProduct(form, token);
      }
      navigate('/products');
    } catch (err) {
      setMsg(err?.message || (isEditMode ? 'Update failed' : 'Create failed'));
    }
  };

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit} className="product-form" aria-label="product-form">
        <h2>{isEditMode ? 'Edit Product' : 'Create Product'}</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input id="price" name="price" type="number" value={form.price} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input id="quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            <option>SPORT</option>
            <option>ELECTRONIC</option>
            <option>FOOD</option>
          </select>
        </div>

        {msg && (
          <p className="error-message" role="alert">
            {typeof msg === 'string' ? msg : JSON.stringify(msg)}
          </p>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
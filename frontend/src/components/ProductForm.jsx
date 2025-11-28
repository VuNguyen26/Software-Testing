import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateProduct } from '../utils/validateProduct.js';
import { createProduct, getProductById, updateProduct } from '../services/productService.js';
import './ProductForm.css';

export default function ProductForm({ token }) {
  const [form, setForm] = useState({ name: '', price: 0, quantity: 0, description: '', category: 'SPORT' });
  const [msg, setMsg] = useState({ text: null, type: '' }); // { text, type: 'success' | 'error' }
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      getProductById(id, token)
        .then(product => setForm(product))
        .catch(err => setMsg({ text: err?.message || 'Failed to load product data', type: 'error' }));
    }
  }, [id, isEditMode, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'price' || name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: null, type: '' });
    const validationError = validateProduct(form);
    if (validationError !== true) {
      return setMsg({ text: validationError, type: 'error' });
    }

    try {
      if (isEditMode) {
        const updated = await updateProduct(id, form, token);
        setMsg({ text: `Updated product id=${updated.id}`, type: 'success' });
        // navigate('/products');
      } else {
        const created = await createProduct(form, token);
        setMsg({ text: `Created product id=${created.id}`, type: 'success' });
        // navigate('/products');
      }
    } catch (err) {
      setMsg({ text: err?.message || (isEditMode ? 'Update failed' : 'Create failed'), type: 'error' });
    }
  };

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit} className="product-form" aria-label="product-form">
        <h2>{isEditMode ? 'Edit Product' : 'Create Product'}</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} data-testid="product-name-input" />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input id="price" name="price" type="number" value={form.price} onChange={handleChange} data-testid="product-price-input" />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input id="quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} data-testid="product-quantity-input" />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} data-testid="product-description-input" />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange} data-testid="product-category-input">
            <option>SPORT</option>
            <option>ELECTRONIC</option>
            <option>FOOD</option>
          </select>
        </div>

        {msg.text && (
          <div role={msg.type === 'error' ? 'alert' : 'status'} data-testid={msg.type === 'error' ? 'validation-error' : 'notification'}>
            {typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}
          </div>
        )}
        <button type="submit" data-testid="save-product-button">Save</button>
      </form>
    </div>
  );
}
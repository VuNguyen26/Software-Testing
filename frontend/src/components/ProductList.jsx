import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/productService';
import './ProductList.css';

export default function ProductList({ token }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = () => {
    getProducts(token)
      .then(setProducts)
      .catch((err) => setError(err?.message || 'Load failed'));
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id, token);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        setError(err?.message || 'Delete failed');
      }
    }
  };
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Products</h1>
        <div className="product-list-actions">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Link to="/products/new" className="btn btn-primary" data-testid="add-product-button">
            Create New Product
          </Link>
        </div>
      </div>
      {error && <p role="alert" className="error-message">{error}</p>}
      <table className="product-table" data-testid="product-list">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id} data-testid="product-item">
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <Link to={`/products/${p.id}/edit`}>
                  <button className="btn btn-secondary" data-testid="edit-product-button">Edit</button>
                </Link>
                <button onClick={() => handleDelete(p.id)} className="btn btn-danger" data-testid="delete-product-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { api } from './api.js'

// Tạo sản phẩm (đã có sẵn)
export async function createProduct(body, token) {
  const { data } = await api.post('/products', body, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return data
}

// Lấy danh sách sản phẩm
export async function getProducts(token) {
  const { data } = await api.get('/products', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return data
}

// Lấy chi tiết sản phẩm theo ID
export async function getProductById(id, token) {
  const { data } = await api.get(`/products/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return data
}

// Cập nhật sản phẩm
export async function updateProduct(id, body, token) {
  const { data } = await api.put(`/products/${id}`, body, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return data
}

// Xóa sản phẩm
export async function deleteProduct(id, token) {
  const { data } = await api.delete(`/products/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return data
}

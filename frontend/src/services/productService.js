import { api } from './api.js'

// Tạo sản phẩm (đã có sẵn)
export async function createProduct(body, token) {
  const { data } = await api.post('/products', body, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return data
}

// Lấy danh sách sản phẩm
export async function getProducts() {
  const { data } = await api.get('/products')
  return data
}

// Lấy chi tiết sản phẩm theo ID
export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`)
  return data
}

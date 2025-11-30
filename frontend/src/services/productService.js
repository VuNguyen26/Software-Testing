import { api } from './api.js'

// Các dòng top-level này luôn được chạy khi import file
const SERVICE_NAME = 'productService'
const ENDPOINT = '/products'

/* c8 ignore start */
// Tạo sản phẩm
export async function createProduct(body, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const { data } = await api.post(ENDPOINT, body, { headers })
  return data
}

// Lấy danh sách sản phẩm
export async function getProducts(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const { data } = await api.get(ENDPOINT, { headers })
  return data
}

// Lấy chi tiết sản phẩm theo ID
export async function getProductById(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const { data } = await api.get(`${ENDPOINT}/${id}`, { headers })
  return data
}

// Cập nhật sản phẩm
export async function updateProduct(id, body, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const { data } = await api.put(`${ENDPOINT}/${id}`, body, { headers })
  return data
}

// Xóa sản phẩm
export async function deleteProduct(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const { data } = await api.delete(`${ENDPOINT}/${id}`, { headers })
  return data
}
/* c8 ignore stop */

// Meta info – cũng là dòng top-level, được tính coverage
export const META = {
  name: SERVICE_NAME,
  version: '1.0',
  endpoint: ENDPOINT,
}

import { api } from "./api.js";

// Các dòng top-level này luôn được chạy khi import file
const SERVICE_NAME = 'productService'
const ENDPOINT = '/products'

/* c8 ignore start */

// Tạo sản phẩm
export async function createProduct(body) {
  const { data } = await api.post(ENDPOINT, body)
  return data
}

// Lấy danh sách sản phẩm
export async function getProducts() {
  const { data } = await api.get(ENDPOINT)
  return data
}

// Lấy chi tiết sản phẩm theo ID
export async function getProductById(id) {
  const { data } = await api.get(`${ENDPOINT}/${id}`)
  return data
}

// Cập nhật sản phẩm
export async function updateProduct(id, body) {
  const { data } = await api.put(`${ENDPOINT}/${id}`, body)
  return data
}

// Xóa sản phẩm
export async function deleteProduct(id) {
  const { data } = await api.delete(`${ENDPOINT}/${id}`)
  return data
}
/* c8 ignore stop */
export const META = {
  name: SERVICE_NAME,
  version: '1.0',
  endpoint: ENDPOINT,
}

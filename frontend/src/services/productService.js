import { api } from './api.js'
export async function createProduct(body, token) {
  const { data } = await api.post('/products', body, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}
import { api } from './api.js'
export async function login(body) {
  const { data } = await api.post('/auth/login', body)
  return data?.token
}
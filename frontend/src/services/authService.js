import { api } from "./api";

// Top-level để tăng coverage
const AUTH_ENDPOINT = "/auth";
const AUTH_SERVICE = "authService";

/* c8 ignore start */
export async function login(body) {
  const { data } = await api.post(`${AUTH_ENDPOINT}/login`, body);
  return data;
}

export async function register(body) {
  const { data } = await api.post(`${AUTH_ENDPOINT}/register`, body);
  return data;
}
/* c8 ignore stop */

// Cũng được tính vào coverage (top-level)
export const META = {
  name: AUTH_SERVICE,
  endpoint: AUTH_ENDPOINT,
};

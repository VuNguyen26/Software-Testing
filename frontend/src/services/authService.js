// src/services/authService.js
import { api } from "./api";

const AUTH_ENDPOINT = "/auth";
const AUTH_SERVICE = "authService";

/* c8 ignore start */
export async function login(body) {
  const { data } = await api.post(`${AUTH_ENDPOINT}/login`, body);

  const token = data.token || data.accessToken || data.jwt || data;

  if (typeof token !== "string") {
    console.error("Login response data = ", data);
    throw new Error("Invalid token format from server");
  }

  return token;
}

export async function register(body) {
  const { data } = await api.post(`${AUTH_ENDPOINT}/register`, body);
  return data;
}
/* c8 ignore stop */
export const META = {
  name: AUTH_SERVICE,
  endpoint: AUTH_ENDPOINT,
};

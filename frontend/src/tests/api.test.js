// src/tests/api.test.js
import { describe, it, expect, afterEach, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  localStorage.clear();
});

describe("api.js config & interceptor", () => {
  it("dùng VITE_API_BASE khi biến môi trường tồn tại", async () => {
    import.meta.env.VITE_API_BASE = "http://custom-api:9000";

    const { api } = await import("../services/api.js");

    expect(api.defaults.baseURL).toBe("http://custom-api:9000");
  });

  it("fallback về http://localhost:8080/api khi không có VITE_API_BASE", async () => {
    delete import.meta.env.VITE_API_BASE;

    const { api } = await import("../services/api.js");

    expect(api.defaults.baseURL).toBe("http://localhost:8080/api");
  });

  it("interceptor thêm header Authorization khi có token", async () => {
    import.meta.env.VITE_API_BASE = "http://any"; // cho chắc
    localStorage.setItem("token", "abc123");

    const { api } = await import("../services/api.js");

    // axios lưu interceptor trong mảng handlers
    const handler = api.interceptors.request.handlers[0].fulfilled;

    const config = handler({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer abc123");
  });

  it("interceptor KHÔNG thêm Authorization khi không có token", async () => {
    import.meta.env.VITE_API_BASE = "http://any";
    localStorage.removeItem("token");

    const { api } = await import("../services/api.js");

    const handler = api.interceptors.request.handlers[0].fulfilled;

    const config = handler({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });
});

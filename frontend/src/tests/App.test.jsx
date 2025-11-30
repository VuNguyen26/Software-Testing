import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App.jsx";

// Mock LoginForm: có nút login
vi.mock("../components/LoginForm.jsx", () => ({
  default: ({ onSuccess }) => (
    <div>
      <h2>Mock Login</h2>
      <button
        data-testid="mock-login-btn"
        onClick={() => onSuccess("mock-token")}
      >
        Do Login
      </button>
    </div>
  ),
}));

// Mock DashboardLayout: thêm nút logout để test handleLogout
vi.mock("../components/DashboardLayout.jsx", () => ({
  default: ({ handleLogout }) => (
    <div data-testid="mock-dashboard">
      Mock Dashboard
      <button data-testid="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  ),
}));

beforeEach(() => {
  localStorage.clear();
});

describe("App routing & auth flow", () => {
  it("hiển thị màn login khi chưa có token", () => {
    localStorage.removeItem("token");
    render(<App />);

    expect(screen.getByText(/mock login/i)).toBeInTheDocument();
    expect(screen.queryByTestId("mock-dashboard")).toBeNull();
  });

  it("sau khi login thành công thì lưu token và hiển thị dashboard", () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("mock-login-btn"));

    expect(localStorage.getItem("token")).toBe("mock-token");
    expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();
  });

  it("logout → xoá token và quay lại LoginForm", () => {
    // Setup trạng thái đã login
    localStorage.setItem("token", "mock-token");

    render(<App />);

    // Dashboard đang hiển thị
    expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();

    // Click logout
    fireEvent.click(screen.getByTestId("logout-btn"));

    // Token phải bị xoá
    expect(localStorage.getItem("token")).toBeNull();

    // Quay về login form
    expect(screen.getByText(/mock login/i)).toBeInTheDocument();
  });
});

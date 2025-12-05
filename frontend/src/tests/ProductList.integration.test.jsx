/**
 * ProductList Integration Test – FULL COVERAGE
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// MOCK SERVICE MODULE
vi.mock("../services/productService.js", () => ({
  getProducts: vi.fn(),
  deleteProduct: vi.fn(),
}));

import {
  getProducts,
  deleteProduct,
} from "../services/productService.js";

import ProductList from "../components/ProductList.jsx";

describe("ProductList Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "dummy-token");
  });

  // Load success
  test("Hiển thị danh sách sản phẩm từ API", async () => {
    getProducts.mockResolvedValueOnce([
      { id: 1, name: "Ball", price: 100, quantity: 2 },
      { id: 2, name: "Shoes", price: 200, quantity: 1 },
    ]);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    const rows = await screen.findAllByTestId("product-item");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("Ball");
  });

  // API error
  test("Hiển thị lỗi khi API lỗi", async () => {
    getProducts.mockRejectedValueOnce(new Error("Server error"));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/server error/i);
  });

  // Search / filter
  test("Search filter hoạt động", async () => {
    getProducts.mockResolvedValueOnce([
      { id: 1, name: "Ball", price: 100, quantity: 2 },
      { id: 2, name: "Shoes", price: 200, quantity: 1 },
    ]);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    await screen.findAllByTestId("product-item");

    // nhập để lọc "ball"
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "ball" },
    });

    const rows = screen.getAllByTestId("product-item");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent("Ball");
  });

  // Delete → confirm = cancel (no delete)
  test("Không xóa khi user CANCEL confirm box", async () => {
    getProducts.mockResolvedValueOnce([
      { id: 1, name: "Ball", price: 100, quantity: 2 },
    ]);

    // fake window.confirm
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    await screen.findByTestId("product-item");

    fireEvent.click(screen.getByTestId("delete-product-button"));

    expect(deleteProduct).not.toHaveBeenCalled();
  });

  // Delete → success
  test("Xóa sản phẩm thành công", async () => {
    getProducts.mockResolvedValueOnce([
      { id: 1, name: "Ball", price: 100, quantity: 2 },
    ]);
    deleteProduct.mockResolvedValueOnce({});

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    await screen.findByTestId("product-item");

    fireEvent.click(screen.getByTestId("delete-product-button"));

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith(1, "dummy-token");
    });
  });

  // Delete → API error
  test("Xóa thất bại → hiển thị lỗi", async () => {
    getProducts.mockResolvedValueOnce([
      { id: 1, name: "Ball", price: 100, quantity: 2 },
    ]);
    deleteProduct.mockRejectedValueOnce(new Error("Delete failed"));

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    await screen.findByTestId("product-item");

    fireEvent.click(screen.getByTestId("delete-product-button"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/delete failed/i);
  });
});

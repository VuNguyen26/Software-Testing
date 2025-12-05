/**
 * Integration Test – ProductForm + productService
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate TRƯỚC khi import component
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Bypass validation để không chặn submit
vi.mock("../utils/validateProduct.js", () => ({
  validateProduct: () => true,
}));

// Mock service module đúng cách
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockGet = vi.fn();

vi.mock("../services/productService.js", () => ({
  createProduct: (...args) => mockCreate(...args),
  updateProduct: (...args) => mockUpdate(...args),
  getProductById: (...args) => mockGet(...args),
}));

// Sau khi mock xong MỚI import component
import ProductForm from "../components/ProductForm.jsx";

describe("ProductForm Integration", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockGet.mockReset();
  });

  // Create Success
  it("Tạo sản phẩm thành công → gọi API đúng payload", async () => {
    mockCreate.mockResolvedValueOnce({ id: 1 });

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "Ball" },
    });
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity-input"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("product-description-input"), {
      target: { value: "A nice ball" },
    });
    fireEvent.change(screen.getByTestId("product-category-input"), {
      target: { value: "SPORT" },
    });

    fireEvent.click(screen.getByTestId("save-product-button"));

    // Chờ React gọi API
    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ball",
        price: 1000,
        quantity: 1,
        description: "A nice ball",
        category: "SPORT",
      })
    );

    // Kiểm tra UI status
    const message = await screen.findByRole("status");
    expect(message).toHaveTextContent(/id=1/i);
  });

  // Create Error
  it("Tạo sản phẩm lỗi → hiển thị lỗi", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Server error"));

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "Ball" },
    });

    fireEvent.click(screen.getByTestId("save-product-button"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/server error/i);
  });
});

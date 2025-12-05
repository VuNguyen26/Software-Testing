/**
 * ProductDetail Integration Test – FULL COVERAGE
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// Mock service
vi.mock("../services/productService.js", () => ({
  getProductById: vi.fn(),
}));

import { getProductById } from "../services/productService.js";
import ProductDetail from "../components/ProductDetail.jsx";

describe("ProductDetail Integration", () => {
  afterEach(() => vi.clearAllMocks());

  test("Hiển thị Loading ban đầu", () => {
    // mock Promise pending (không resolve, không reject)
    getProductById.mockReturnValue(new Promise(() => {}));

    render(<ProductDetail id={1} />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  test("Hiển thị chi tiết sản phẩm khi load thành công", async () => {
    getProductById.mockResolvedValueOnce({
      id: 1,
      name: "Ball",
      price: 1000,
      quantity: 2,
      category: "SPORT",
    });

    render(<ProductDetail id={1} />);

    expect(getProductById).toHaveBeenCalledWith(1);

    expect(await screen.findByLabelText("product-detail")).toBeInTheDocument();
    expect(screen.getByText("Ball")).toBeInTheDocument();
    expect(screen.getByTestId("price")).toHaveTextContent("1000");
  });

  test("Hiển thị lỗi khi API trả về lỗi có message", async () => {
    getProductById.mockRejectedValueOnce(new Error("Not found"));

    render(<ProductDetail id={99} />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/not found/i);
  });

  test("Hiển thị lỗi default khi API lỗi không có message", async () => {
    getProductById.mockRejectedValueOnce({});

    render(<ProductDetail id={999} />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Load failed");
  });
});

// src/tests/ProductForm.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import * as svc from "../services/productService.js";
import { validateProduct } from "../utils/validateProduct.js";
import ProductForm from "../components/ProductForm.jsx";

vi.mock("../utils/validateProduct.js", () => ({
  validateProduct: vi.fn(),
}));

describe("ProductForm", () => {
  beforeEach(() => vi.clearAllMocks());

  /* -----------------------------
     1) CREATE SUCCESS (STATUS)
  ----------------------------- */
  it("create success → show status message", async () => {
    validateProduct.mockReturnValue(true);
    vi.spyOn(svc, "createProduct").mockResolvedValueOnce({ id: 1 });

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByTestId("product-quantity-input"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByTestId("save-product-button"));

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("Created product id=1");
  });

  /* -----------------------------
     2) VALIDATION STRING → ALERT
  ----------------------------- */
  it("validation returns string → show alert", async () => {
    validateProduct.mockReturnValue("Name required");

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("save-product-button"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Name required");
  });

  /* -----------------------------
     3) VALIDATION OBJECT → covers 37–40
  ----------------------------- */
  it("validation returns object → join messages", async () => {
    validateProduct.mockReturnValue({
      name: "Name required",
      price: "Price invalid",
    });

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("save-product-button"));

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent("Name required");
    expect(alert).toHaveTextContent("Price invalid");
  });

  /* -----------------------------
     4) UPDATE SUCCESS → covers 98–99
  ----------------------------- */
  it("update success → show status message", async () => {
    validateProduct.mockReturnValue(true);

    vi.spyOn(svc, "getProductById").mockResolvedValue({
      id: 5,
      name: "A",
      price: 10,
      quantity: 1,
      description: "Old",
      category: "SPORT",
    });

    vi.spyOn(svc, "updateProduct").mockResolvedValueOnce({ id: 5 });

    render(
      <MemoryRouter initialEntries={["/edit/5"]}>
        <Routes>
          <Route path="/edit/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("product-description-input"), {
      target: { value: "Updated" },
    });

    fireEvent.click(screen.getByTestId("save-product-button"));

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("Updated product id=5");
  });

  /* -----------------------------
     5) CREATE ERROR
  ----------------------------- */
  it("create error → alert", async () => {
    validateProduct.mockReturnValue(true);
    vi.spyOn(svc, "createProduct").mockRejectedValueOnce(new Error("Server error"));

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "New" },
    });

    fireEvent.click(screen.getByTestId("save-product-button"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Server error");
  });

  /* -----------------------------
     6) UPDATE ERROR
  ----------------------------- */
  it("update error → alert", async () => {
    validateProduct.mockReturnValue(true);

    vi.spyOn(svc, "getProductById").mockResolvedValue({
      id: 5,
      name: "A",
      price: 10,
      quantity: 1,
      description: "Old",
      category: "SPORT",
    });

    vi.spyOn(svc, "updateProduct").mockRejectedValueOnce(new Error("Update fail"));

    render(
      <MemoryRouter initialEntries={["/edit/5"]}>
        <Routes>
          <Route path="/edit/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("save-product-button"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Update fail");
  });
});

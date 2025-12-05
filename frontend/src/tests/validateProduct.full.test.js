import { describe, it, expect } from "vitest";
import { validateProduct } from "../utils/validateProduct.js";

describe("validateProduct (full coverage)", () => {
  it("returns error when product is null", () => {
    const result = validateProduct(null);
    expect(result.general).toBe("Invalid product");
  });

  it("rejects missing name", () => {
    const p = { name: "", price: 10, quantity: 1 };
    const result = validateProduct(p);
    expect(result.name).toBe("Product name is required");
  });

  it("rejects short name (< 3 chars)", () => {
    const result = validateProduct({ name: "ab", price: 10, quantity: 1 });
    expect(result.name).toBe("Product name is too short");
  });

  it("rejects long name (> 100 chars)", () => {
    const longName = "a".repeat(101);
    const result = validateProduct({ name: longName, price: 10, quantity: 1 });
    expect(result.name).toBe("Product name is too long");
  });

  it("description too long", () => {
    const longDesc = "x".repeat(501);
    const result = validateProduct({
      name: "Valid",
      price: 10,
      quantity: 1,
      description: longDesc,
    });
    expect(result.description).toBe("Description too long");
  });

  it("rejects price <= 0", () => {
    const result = validateProduct({
      name: "Valid",
      price: 0,
      quantity: 1,
    });
    expect(result.price).toBe("Price must be greater than 0");
  });

  it("rejects price > 1 billion", () => {
    const result = validateProduct({
      name: "Valid",
      price: 1000000000,
      quantity: 1,
    });
    expect(result.price).toBe("Price must be less than 1 billion");
  });

  it("rejects negative quantity", () => {
    const result = validateProduct({
      name: "Valid",
      price: 10,
      quantity: -1,
    });
    expect(result.quantity).toBe("Quantity cannot be negative");
  });

  it("rejects invalid category", () => {
    const result = validateProduct({
      name: "Valid",
      price: 10,
      quantity: 1,
      category: "INVALID",
    });
    expect(result.category).toBe("Invalid category");
  });

  it("valid product → returns {}", () => {
    const result = validateProduct({
      name: "Product A",
      price: 100,
      quantity: 5,
      description: "OK",
      category: "SPORT",
    });
    expect(result).toEqual({});
  });
});

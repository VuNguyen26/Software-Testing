import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as productService from "@/services/productService";

// Mock validate để không bị chặn
vi.mock("@/utils/validateProduct", () => ({
  validateProduct: () => true,
}));

import ProductForm from "@/components/ProductForm";

describe("Mock testing for ProductForm", () => {
  test("mock create product success", async () => {
    const spy = vi
      .spyOn(productService, "createProduct")
      .mockResolvedValueOnce({ id: 123 });

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Cake" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: 1000 },
    });
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: 5 },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Delicious cake" },
    });

    fireEvent.change(screen.getByTestId("product-category-input"), {
      target: { value: "FOOD" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Cake",
        price: 1000,
        quantity: 5,
        description: "Delicious cake",
        category: "FOOD",
      })
    );

    const success = await screen.findByRole("status");
    expect(success).toHaveTextContent(/id=123/i);

    spy.mockRestore();
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import * as productService from "@/services/productService"
import * as validateUtils from "@/utils/validateProduct"
import ProductForm from "@/components/ProductForm"

// Mock validation để bỏ qua lỗi
vi.mock("@/utils/validateProduct", () => ({
  validateProduct: vi.fn(() => true),
}))

describe("Mock testing for ProductForm", () => {
  test("mock create product success", async () => {
    // Dùng spyOn cho đúng reference
    const spy = vi.spyOn(productService, "createProduct").mockResolvedValueOnce({ id: 123 })

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Cake" } })
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: 1000 } })
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: 5 } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Delicious cake" } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "FOOD" } })

    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    // Đợi async xử lý
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Cake",
        price: 1000,
        quantity: 5,
        description: "Delicious cake",
        category: "FOOD",
      }),
      undefined
    )

    // Kiểm tra UI hiển thị kết quả
    const successMessage = await screen.findByRole('status')
    expect(successMessage).toHaveTextContent(/id=123/i)

    spy.mockRestore()
  })
})

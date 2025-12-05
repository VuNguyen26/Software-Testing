import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, test, expect, vi, afterEach } from "vitest"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import * as productService from "@/services/productService"
// Lưu ý: Đảm bảo đường dẫn import đúng với cấu trúc dự án của bạn
import ProductForm from "@/components/ProductForm" 

// Mock validation để bỏ qua logic kiểm tra form (tập trung test luồng gọi API)
vi.mock("@/utils/validateProduct", () => ({
  validateProduct: vi.fn(() => true),
}))

describe("ProductForm Integration Mock Tests", () => {
  
  // Dọn dẹp mock sau mỗi test case để tránh ảnh hưởng lẫn nhau
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // --- 1. CREATE FLOW: Tạo sản phẩm thành công ---
  test("Create new product successfully", async () => {
    // Mock service trả về thành công
    const createSpy = vi.spyOn(productService, "createProduct").mockResolvedValueOnce({ id: 123 })

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    )

    // Điền dữ liệu vào form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "New Cake" } })
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: 1000 } })
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: 5 } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Yummy" } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "FOOD" } })

    // Bấm nút Submit
    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    // Verify: Đảm bảo API createProduct được gọi đúng tham số
    await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1))
    
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Cake",
        price: 1000,
        quantity: 5,
        category: "FOOD",
      })
      // Note: token parameter is optional and may not be passed
    )

    // Verify: UI hiển thị thông báo thành công
    const successMessage = await screen.findByRole('status') 
    expect(successMessage).toHaveTextContent(/id=123/i)
  })

  // --- 2. ERROR FLOW: Xử lý lỗi từ Server khi tạo ---
  test("Handle server error when creating product", async () => {
    // Mock service trả về lỗi (Rejected)
    const createSpy = vi.spyOn(productService, "createProduct").mockRejectedValueOnce(new Error("Internal Server Error"))

    render(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    )

    // Điền dữ liệu hợp lệ
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Error Cake" } })
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: 500 } })
    
    // Bấm nút Submit
    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    // Verify: API vẫn được gọi
    await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1))

    // Verify: UI hiển thị thông báo lỗi
    const errorMessage = await screen.findByRole('alert')
    expect(errorMessage).toHaveTextContent(/error/i)
  })

  // --- 3. READ FLOW: Load dữ liệu sản phẩm để sửa (GetById) ---
  test("Load product details from URL for editing", async () => {
    // Mock dữ liệu trả về từ API khi gọi getById
    const mockData = { 
      id: 888, 
      name: "Loaded Cake", 
      price: 500, 
      quantity: 2, 
      description: "Loaded desc",
      category: "FOOD" 
    }
    
    // Mock service getProductById
    const getByIdSpy = vi.spyOn(productService, "getProductById").mockResolvedValueOnce(mockData)

    // Render Form giả lập đang ở đường dẫn /products/edit/888
    render(
      <MemoryRouter initialEntries={['/products/edit/888']}>
        <Routes>
          <Route path="/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    )

    // Verify: API được gọi với đúng ID từ URL
    await waitFor(() => expect(getByIdSpy).toHaveBeenCalledWith("888"))

    // Verify: Dữ liệu đã được điền tự động vào ô input
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue("Loaded Cake")
      expect(screen.getByLabelText(/price/i)).toHaveValue(500)
    })
  })

  // --- 4. UPDATE FLOW: Cập nhật sản phẩm thành công ---
  test("Update existing product successfully", async () => {
    // Mock getById (để load data ban đầu)
    vi.spyOn(productService, "getProductById").mockResolvedValueOnce({ 
      id: 999, name: "Old Name", price: 200 
    })

    // Mock updateProduct (trả về kết quả sau khi sửa)
    const updateSpy = vi.spyOn(productService, "updateProduct").mockResolvedValueOnce({ id: 999, name: "Updated Name" })
    const createSpy = vi.spyOn(productService, "createProduct") // Để chắc chắn không gọi nhầm

    render(
      <MemoryRouter initialEntries={['/products/edit/999']}>
        <Routes>
          <Route path="/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    )

    // Đợi data load xong
    await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue("Old Name"))

    // Thực hiện sửa tên
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Updated Name" } })

    // Bấm Lưu
    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    // Verify: Gọi hàm updateProduct với ID và Data mới
    await waitFor(() => expect(updateSpy).toHaveBeenCalledTimes(1))
    expect(createSpy).not.toHaveBeenCalled()

    expect(updateSpy).toHaveBeenCalledWith(
      "999", // ID từ URL
      expect.objectContaining({ name: "Updated Name" })
    )
  })
})
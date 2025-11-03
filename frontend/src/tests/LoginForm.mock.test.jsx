import { render, screen, fireEvent } from "@testing-library/react"
import * as authService from "@/services/authService"
import LoginForm from "@/components/LoginForm"

// Giả lập toàn bộ module authService
vi.mock("@/services/authService", () => ({
  login: vi.fn(),
}))

// Tạo 1 test suite với describe/test
describe("Mock testing for LoginForm", () => {
  test("mock login success & failure", async () => {
    // THÀNH CÔNG
    authService.login.mockResolvedValueOnce({ token: "demo-token" })
    render(<LoginForm />)

    // Form của bạn không có htmlFor trong label, nên dùng getAllByRole thay vì getByLabelText
    const usernameInput = screen.getByRole("textbox") // input đầu tiên là text
    const passwordInput = document.querySelector('input[type="password"]') // tìm input password theo type

    fireEvent.change(usernameInput, { target: { value: "admin" } })
    fireEvent.change(passwordInput, { target: { value: "Admin123" } })


    // Nút bạn hiển thị chữ "Sign in", nên đổi selector cho đúng
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    // Chờ hiển thị thông báo thành công (giả sử có dòng text "Success" hoặc tương tự)
    expect(await screen.findByText(/success/i)).toBeInTheDocument()

    // Kiểm tra số lần gọi mock
    expect(authService.login).toHaveBeenCalledTimes(1)

    // THẤT BẠI
    authService.login.mockRejectedValueOnce(new Error("Invalid credentials"))
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    // Chờ thông báo lỗi
    expect(await screen.findByText(/invalid/i)).toBeInTheDocument()
  })
})

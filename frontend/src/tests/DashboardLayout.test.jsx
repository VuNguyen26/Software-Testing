import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout.jsx";

describe("DashboardLayout", () => {
  it("render Sidebar + Outlet content", () => {
    const handleLogout = vi.fn();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<DashboardLayout handleLogout={handleLogout} />}>
            <Route
              index
              element={<div data-testid="inner-content">Hello dashboard</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Nội dung trong Outlet render ok
    expect(screen.getByTestId("inner-content")).toBeInTheDocument();
  });

  it("gọi handleLogout khi bấm nút logout trong Sidebar", () => {
    const handleLogout = vi.fn();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<DashboardLayout handleLogout={handleLogout} />}>
            <Route index element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Giả định Sidebar chỉ có 1 button là Logout
    const logoutBtn = screen.getByRole("button");
    fireEvent.click(logoutBtn);

    expect(handleLogout).toHaveBeenCalled();
  });
});

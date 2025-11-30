/* c8 ignore file */
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout({ handleLogout }) {
  return (
    <div className="dashboard-layout">
      <Sidebar handleLogout={handleLogout} />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

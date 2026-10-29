import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Bell, UserRound } from "lucide-react";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <span className="header-workspace">
              Employee Management
            </span>
          </div>

          <div className="header-actions">
            <Bell size={19} />
            <div className="user-avatar">
              <UserRound size={18} />
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
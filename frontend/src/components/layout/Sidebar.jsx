import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  BriefcaseBusiness,
} from "lucide-react";

const links = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Employees", path: "/employees", icon: Users },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={21} />
          </div>
          <span>EmployeeHub</span>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {links.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-section-label">PREFERENCES</div>
          <div className="sidebar-link sidebar-static">
            <Settings size={19} />
            Settings
          </div>
        </div>
      </aside>
    </>
  );
}
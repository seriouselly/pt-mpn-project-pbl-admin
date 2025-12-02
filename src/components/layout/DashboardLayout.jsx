import { useState } from "react";
import Navbar from "./Navbar";
import "../../styles/components/DashboardLayout.css";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    alert("Logout berhasil!");
    // Redirect ke halaman login bisa ditambahkan di sini
  };

  return (
    <div className="dashboard-layout min-vh-100 bg-light">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Navbar + Content */}
      <div
        className={`main-content transition-all`}
        style={{ marginLeft: sidebarCollapsed ? "64px" : "250px" }}
      >
        <Navbar onLogout={handleLogout} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

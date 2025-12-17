import "../../styles/components/Navbar.css";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Judul */}
        <span className="navbar-brand fw-semibold fs-4">
          Admin Dashboard
        </span>

        {/* Kanan: Avatar + Nama + Logout */}
        <div className="d-flex align-items-center gap-3">

          {/* Avatar */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              className="rounded-circle"
              width="36"
              height="36"
              alt="Avatar"
            />
          ) : (
            <div className="avatar-fallback">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          )}

          {/* Nama admin */}
          <span className="fw-medium">{user?.name || "Admin"}</span>

          {/* Tombol Logout */}
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={logout}
          >
            <LogOut size={16} className="me-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

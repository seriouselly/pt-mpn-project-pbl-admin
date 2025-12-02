import React from "react";
import { LogOut } from "lucide-react";
import "./Navbar.css";

// const Navbar = ({ onLogout }) => {
//   return (
//     <nav className="navbar d-flex align-items-center justify-content-end px-3 shadow-sm">
//       {/* Avatar */}
//       <div className="avatar me-3">
//         <img
//           src="https://i.pravatar.cc/40"
//           alt="User Avatar"
//           className="rounded-circle"
//         />
//       </div>

//       {/* Tombol Logout */}
//       <button className="btn btn-logout d-flex align-items-center" onClick={onLogout}>
//         <LogOut className="me-2" />
//         <span>Logout</span>
//       </button>
//     </nav>
//   );
// };

// export default Navbar;

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
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

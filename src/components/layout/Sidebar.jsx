import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  MessageSquare, 
  Star, 
  ChevronLeft,
  Shield,
  Handshake, // Partner
  Images,
  ListChecks,
  Bug
} from "lucide-react";
import "../../styles/components/Sidebar.css";
import { useAuth } from "../../contexts/AuthContext"; // Import Auth untuk cek role

const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useAuth(); // Ambil data user

  // Menu item dasar
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: GraduationCap, label: "Pelatihan", path: "/pelatihan" },
    { icon: Briefcase, label: "Layanan", path: "/layanan" },
    { icon: Handshake, label: "Partner", path: "/partner" },
    { icon: Images, label: "Galeri", path: "/gallery" },
    // { icon: ListChecks, label: "Detail Layanan", path: "/detail-jenis" },
    { icon: Building2, label: "Profil Perusahaan", path: "/profil-perusahaan" },
    { icon: MessageSquare, label: "Pesan Kontak", path: "/pesan-kontak" },
    { icon: Star, label: "Testimoni", path: "/testimoni" },
  ];

  // Tambahkan menu Admin jika role SUPERADMIN
  if (user?.role === "SUPERADMIN") {
    menuItems.push({ icon: Shield, label: "Manajemen Admin", path: "/admin" });
  }

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
        {!collapsed && (
          <div className="d-flex align-items-center gap-2">
            <div className="logo-box d-flex align-items-center justify-content-center">
              <span className="logo-text">MPN</span>
            </div>
            <span className="company-name">PT MPN Admin</span>
          </div>
        )}

        <button className={`btn btn-toggle ${collapsed ? "mx-auto" : ""}`} onClick={onToggle}>
          <ChevronLeft className={`chevron-icon ${collapsed ? "rotated" : ""}`} />
        </button>
      </div>

      <nav className="sidebar-menu flex-column mt-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item d-flex align-items-center px-3 py-2 mb-1 rounded ${collapsed ? "justify-content-center" : ""} ${isActive ? "active" : ""}`
              }
            >
              <Icon className="me-2" size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

import "../../styles/components/Navbar.css";
import { LogOut, Menu, User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import ModalItem from "../ModalItem";
import { updateUser } from "../../api/userApi";
import { ToastContainer, toast } from "react-toastify";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    telp: "",
    password: "",
    currentPassword: "",
  });

  const handleEditProfile = () => {
    // Set form dengan data user terbaru
    const currentTelp = user?.telp || user?.phone || "";
    console.log(
      "Opening edit profile. User telp:",
      currentTelp,
      "Full user:",
      user
    );

    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      telp: currentTelp,
      password: "",
      currentPassword: "",
    });
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const handleSubmitEdit = async () => {
    if (!editForm.name || !editForm.email || !editForm.telp) {
      toast.warn("Nama, Email, dan Telepon wajib diisi");
      return;
    }
    if (!/^[0-9]{11,15}$/.test(editForm.telp.trim())) {
      toast.warn("Nomor telepon wajib 11-15 digit angka");
      return;
    }
    if (editForm.password && !editForm.currentPassword) {
      toast.warn("Masukkan password saat ini untuk mengganti password");
      return;
    }

    const passwordChanged = !!editForm.password;

    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        telp: editForm.telp,
      };

      if (passwordChanged) {
        payload.password = editForm.password;
        payload.currentPassword = editForm.currentPassword;
      }

      await updateUser(user?.id, payload);

      // Update user di localStorage dengan data terbaru
      // Ini penting agar data tidak hilang saat login ulang
      const updatedUser = {
        ...user,
        name: editForm.name,
        email: editForm.email,
        telp: editForm.telp,
      };
      localStorage.setItem("mpn_admin_user", JSON.stringify(updatedUser));

      // Tutup modal
      setShowEditModal(false);

      if (passwordChanged) {
        // Jika password diubah, beri notifikasi dan logout setelah delay lebih lama
        toast.success(
          "Password berhasil diubah! Silakan login ulang dengan password baru.",
          { autoClose: 3000 }
        );
        setTimeout(() => {
          logout();
        }, 3500);
      } else {
        // Jika hanya data biasa, cukup refresh halaman
        toast.success("Profil berhasil diperbarui!", { autoClose: 2000 });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        "Gagal memperbarui profil";
      toast.error(errMsg);
    }
  };

  return (
    <>
      <nav className="navbar navbar-light bg-white border-bottom px-4 shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Judul */}
          <span className="navbar-brand fw-semibold fs-4">Admin Dashboard</span>

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

            {/* Tombol Logout atau Dropdown Menu */}
            {user?.role === "SUPERADMIN" ? (
              // SUPERADMIN: Tombol logout biasa
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={logout}
              >
                <LogOut size={16} className="me-1" />
                Logout
              </button>
            ) : (
              // ADMIN: Dropdown menu dengan ikon garis tiga
              <div className="dropdown position-relative">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                >
                  <Menu size={18} />
                </button>
                {showDropdown && (
                  <div
                    className="dropdown-menu dropdown-menu-end show position-absolute"
                    style={{ right: 0, minWidth: "200px" }}
                  >
                    <button
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={handleEditProfile}
                    >
                      <User size={16} />
                      Edit Profil
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 text-danger"
                      onClick={logout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Modal Edit Profil */}
      <ModalItem
        key={showEditModal ? "edit-open" : "edit-closed"} // Force re-render saat modal dibuka
        show={showEditModal}
        title="Edit Profil"
        fields={[
          { name: "name", label: "Nama Lengkap", type: "text" },
          { name: "email", label: "Email", type: "text" },
          { name: "telp", label: "No. Telepon", type: "text" },
          {
            name: "password",
            label: "Password Baru",
            type: "password",
            placeholder: "Kosongkan jika tidak diubah",
          },
          {
            name: "currentPassword",
            label: "Password Saat Ini",
            type: "password",
            placeholder: "Wajib jika mengganti password",
          },
        ]}
        value={editForm}
        onChange={setEditForm}
        onSubmit={handleSubmitEdit}
        onClose={() => setShowEditModal(false)}
      />
      <ToastContainer position="top-right" />
    </>
  );
}

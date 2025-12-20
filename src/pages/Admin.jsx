import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  getUsers,
  createUser,
  updateUser,
  updateUserById,
  deleteUser,
} from "../api/userApi";
import ModalItem from "../components/ModalItem";
import { ToastContainer, toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AdminPage() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "", // Password wajib saat create
    telp: "",
    currentPassword: "",
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      const list = res?.data || res || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat daftar admin (Mungkin anda bukan Superadmin)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.role === "SUPERADMIN") {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const handleSubmit = async () => {
    const isEdit = !!form.id;
    const telp = (form.telp || "").trim();
    if (!form.name || !form.email || !telp) {
      toast.warn("Nama, Email, dan Telepon wajib diisi");
      return;
    }
    if (!/^[0-9]{11,15}$/.test(telp)) {
      toast.warn("Nomor telepon wajib 11-15 digit angka");
      return;
    }
    if (!isEdit && !form.password) {
      toast.warn("Password wajib diisi untuk admin baru");
      return;
    }
    if (isEdit && form.password && !form.currentPassword) {
      toast.warn("Masukkan password saat ini untuk mengganti password");
      return;
    }

    // Cek duplikasi email di sisi frontend untuk menghindari error Unique constraint
    const emailLower = (form.email || "").trim().toLowerCase();
    const dup = users.some(
      (u) => (u.email || "").toLowerCase() === emailLower && u.id !== form.id // Exclude user yang sedang di-edit
    );
    if (dup) {
      toast.error("Email sudah digunakan admin lain");
      return;
    }

    try {
      if (isEdit) {
        const payload = { name: form.name, email: form.email, telp };
        const isSelf = authUser && form.id === authUser.id;

        if (form.password) {
          payload.password = form.password;
          // Hanya kirim currentPassword jika edit akun sendiri
          if (isSelf && form.currentPassword) {
            payload.currentPassword = form.currentPassword;
          }
        }

        if (isSelf) {
          await updateUser(form.id, payload);
        } else {
          await updateUserById(form.id, payload);
        }
        toast.success("Admin berhasil diperbarui");
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          telp,
          password: form.password,
        });
        toast.success("Admin baru berhasil ditambahkan");
      }
      setShowModal(false);
      setForm({
        id: null,
        name: "",
        email: "",
        password: "",
        telp: "",
        currentPassword: "",
      });
      loadUsers();
    } catch (error) {
      console.error(error);
      const raw =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        error.message;
      const msg = /unique/i.test(raw || "")
        ? "Email sudah digunakan user lain"
        : raw || "Gagal menambah/mengubah admin";
      toast.error(msg);
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      telp: user.telp,
      password: "",
      currentPassword: "",
    });
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    if (authUser && user.id === authUser.id) {
      toast.error("Tidak dapat menghapus akun sendiri");
      return;
    }
    if (!confirm(`Hapus admin ${user.name}?`)) return;

    try {
      await deleteUser(user.id);
      toast.success("Admin berhasil dihapus");
      loadUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal menghapus admin");
    }
  };

  if (authUser?.role !== "SUPERADMIN") {
    return (
      <DashboardLayout>
        <div className="page-container">
          <div className="alert alert-danger mt-4">
            Halaman ini hanya dapat diakses oleh SUPERADMIN.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Manajemen Admin</h2>
            <p className="text-muted">
              Kelola akun administrator (Khusus Superadmin)
            </p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => {
              setForm({
                id: null,
                name: "",
                email: "",
                password: "",
                telp: "",
                currentPassword: "",
              });
              setShowModal(true);
            }}
            disabled={authUser?.role !== "SUPERADMIN"}
            title={
              authUser?.role !== "SUPERADMIN"
                ? "Hanya SUPERADMIN dapat menambah admin"
                : ""
            }
          >
            <UserPlus size={18} /> Tambah Admin
          </button>
        </div>

        <div className="alert alert-info">
          Sebagai SUPERADMIN, Anda dapat menambah, mengedit, dan menghapus admin
          lain. Perubahan password pada akun sendiri memerlukan Password Saat
          Ini. No. telepon wajib 11-15 digit.
        </div>

        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 ps-4">Nama</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">No. Telepon</th>
                  <th className="py-3 text-center" style={{ width: 160 }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      Memuat data...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      Belum ada data admin lain.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4 py-3 fw-medium">{u.name}</td>
                      <td className="py-3 text-muted">{u.email}</td>
                      <td className="py-3">
                        <span
                          className={`badge ${
                            u.role === "SUPERADMIN"
                              ? "bg-primary"
                              : "bg-secondary"
                          } rounded-pill px-3`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-muted">{u.telp}</td>
                      <td className="py-3 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEdit(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(u)}
                            disabled={authUser && u.id === authUser.id}
                            title={
                              authUser && u.id === authUser.id
                                ? "Tidak dapat menghapus akun sendiri"
                                : ""
                            }
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Admin */}
        <ModalItem
          show={showModal}
          title={form.id ? "Edit Admin" : "Tambah Admin Baru"}
          fields={[
            { name: "name", label: "Nama Lengkap", type: "text" },
            { name: "email", label: "Email", type: "text" },
            {
              name: "password",
              label: form.id ? "Password Baru" : "Password Default",
              type: "password",
              placeholder: form.id ? "Kosongkan jika tidak diubah" : "",
            },
            ...(form.id
              ? [
                  {
                    name: "currentPassword",
                    label: "Password Saat Ini (untuk ganti password)",
                    type: "password",
                  },
                ]
              : []),
            { name: "telp", label: "No. Telepon", type: "text" },
          ]}
          key={form.id || "new"} // paksa reset input saat ganti mode add/edit
          value={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />

        <ToastContainer position="top-right" />
      </div>
    </DashboardLayout>
  );
}

import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import ModalItem from "../components/ModalItem";
import { ToastContainer, toast } from "react-toastify";
import { Shield, UserPlus } from "lucide-react";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "", // Password wajib saat create
    telp: ""
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      // Backend response: { data: [...] } or [...]
      setUsers(res.data || res || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat daftar admin (Mungkin anda bukan Superadmin)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    const isEdit = !!form.id;
    if (!form.name || !form.email || !form.telp) {
      toast.warn("Nama, Email, dan Telepon wajib diisi");
      return;
    }
    if (!isEdit && !form.password) {
      toast.warn("Password wajib diisi untuk admin baru");
      return;
    }

    // Cek duplikasi email di sisi frontend untuk menghindari error Unique constraint
    const emailLower = (form.email || "").trim().toLowerCase();
    const dup = users.some(u => (u.email || "").toLowerCase() === emailLower && (!isEdit || u.id !== form.id));
    if (dup) {
      toast.error("Email sudah digunakan admin lain");
      return;
    }

    try {
      if (isEdit) {
        await updateUser(form.id, form);
        toast.success("Admin berhasil diperbarui");
      } else {
        await createUser(form);
        toast.success("Admin baru berhasil ditambahkan");
      }
      setShowModal(false);
      setForm({ id: null, name: "", email: "", password: "", telp: "" });
      loadUsers();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.errors || error.response?.data?.message || "Gagal menambah/mengubah admin";
      toast.error(msg);
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      telp: user.telp,
      password: ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus admin ini?")) return;
    try {
      await deleteUser(id);
      toast.success("Admin dihapus");
      loadUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Gagal menghapus admin");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Manajemen Admin</h2>
            <p className="text-muted">Kelola akun administrator (Khusus Superadmin)</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setForm({ id: null, name: "", email: "", password: "", telp: "" }); setShowModal(true); }}>
            <UserPlus size={18} /> Tambah Admin
          </button>
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
                  <th className="py-3 text-center" style={{width: 160}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center p-4">Memuat data...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="5" className="text-center p-4">Belum ada data admin lain.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4 py-3 fw-medium">{u.name}</td>
                      <td className="py-3 text-muted">{u.email}</td>
                      <td className="py-3">
                        <span className={`badge ${u.role === 'SUPERADMIN' ? 'bg-primary' : 'bg-secondary'} rounded-pill px-3`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-muted">{u.telp}</td>
                      <td className="py-3 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(u)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>Hapus</button>
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
            { name: "password", label: form.id ? "Password Baru" : "Password Default", type: "password", placeholder: form.id ? "Kosongkan jika tidak diubah" : "" },
            { name: "telp", label: "No. Telepon", type: "text" }
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

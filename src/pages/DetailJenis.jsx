import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import { getDetailJenis, createDetailJenis, updateDetailJenis, deleteDetailJenis } from "../api/detailJenisApi";
import { Plus } from "lucide-react";
import ModalPelatihan from "../components/ModalPelatihan";
import { getPelatihan } from "../api/pelatihanApi";

export default function DetailJenis() {
  const [details, setDetails] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    jenisUsahaId: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [detailRes, jenisRes] = await Promise.all([
        getDetailJenis(),
        getPelatihan(),
      ]);
      const mappedDetails = (detailRes || []).map((item) => ({
        id: item.id || item.id_detail || item.id_detail_jb,
        nama: item.nama || item.nama_detail || item.title || "Detail",
        jenisUsahaId: item.jenisUsahaId || item.jenis_usaha || item.id_jenis_usaha,
      }));

      const jenisData = Array.isArray(jenisRes) ? jenisRes : (jenisRes?.data || []);

      setDetails(mappedDetails);
      setJenisList(jenisData);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat detail jenis bidang usaha");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async () => {
    if (!form.nama) {
      toast.warn("Nama detail wajib diisi");
      return;
    }
    if (!form.jenisUsahaId) {
      toast.warn("Pilih Jenis Usaha (wajib)");
      return;
    }
    const payload = { nama: form.nama, jenisUsahaId: form.jenisUsahaId };

    try {
      if (form.id) {
        await updateDetailJenis(form.id, payload);
        toast.success("Detail diperbarui");
      } else {
        await createDetailJenis(payload);
        toast.success("Detail ditambahkan");
      }
      setShowModal(false);
      setForm({ id: null, nama: "", jenisUsahaId: "" });
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gagal menyimpan detail");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus detail ini?")) return;
    try {
      await deleteDetailJenis(id);
      toast.success("Detail dihapus");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus detail");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Detail Jenis Bidang Usaha</h2>
            <p className="text-muted mb-0">Kelola detail materi/layanan yang ditautkan ke jenis & bidang usaha.</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setForm({ id: null, nama: "", jenisUsahaId: "" }); setShowModal(true); }}>
            <Plus size={18} /> Tambah Detail
          </button>
        </div>

        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Nama Detail</th>
                  <th className="text-center" style={{ width: 140 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="2" className="text-center p-4">Memuat data...</td></tr>
                ) : details.length === 0 ? (
                  <tr><td colSpan="2" className="text-center p-4 text-muted">Belum ada detail.</td></tr>
                ) : (
                  details.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4 fw-semibold">{item.nama}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-outline-warning" onClick={() => { setForm({ id: item.id, nama: item.nama, jenisUsahaId: item.jenisUsahaId || "" }); setShowModal(true); }}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ModalPelatihan
          show={showModal}
          title={form.id ? "Edit Detail" : "Tambah Detail"}
          fields={[
            { name: "nama", label: "Nama Detail", type: "text" },
            { name: "jenisUsahaId", label: "Jenis Usaha (wajib)", type: "select", options: jenisList.map((j) => ({ value: j.id, label: j.nama_jenis })) },
          ]}
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

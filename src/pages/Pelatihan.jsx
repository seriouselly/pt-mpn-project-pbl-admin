import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button, Spinner } from "react-bootstrap";
import { Eye, Trash2, Pen, Plus, Search } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API Backend
import { getPelatihan, createPelatihan, updatePelatihan, deletePelatihan } from "../api/pelatihanApi";
import { getLayanan } from "../api/layananApi"; 

import ModalPelatihan from "../components/ModalPelatihan";
import Pagination from "../components/Pagination";
import "../styles/pages/Pelatihan.css";
import { resolveUploadUrl } from "../utils/url";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://202.10.47.174:8000";

export default function Pelatihan() {
  const [data, setData] = useState([]);
  const [layananList, setLayananList] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Filter & Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [form, setForm] = useState({
    id: null, nama: "", deskripsi: "", kategori: "", foto: "", foto_file: null, status: "active"
  });

  // 1. Load Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resPelatihan, resLayanan] = await Promise.all([
        getPelatihan(), 
        getLayanan()
      ]);

      // Map Pelatihan
      const rawPelatihan = Array.isArray(resPelatihan) ? resPelatihan : (resPelatihan.data || []);
      const mappedPelatihan = rawPelatihan.map((item) => ({
        id: item.id,
        nama: item.nama_jenis,
        deskripsi: item.deskripsi,
        kategori: item.bidangUsahaId, 
        kategori_nama: item.bidang_usaha?.nama_BUsaha || "-", 
        foto: resolveUploadUrl(BASE_URL, item.foto),
        status: item.status || "active"
      }));
      setData(mappedPelatihan);

      // Map Layanan (PERBAIKAN: Langsung set data tanpa variabel 'opts' yg tidak terpakai)
      const rawLayanan = Array.isArray(resLayanan) ? resLayanan : (resLayanan.data || []);
      setLayananList(rawLayanan);

    } catch (error) {
      console.error("Gagal memuat data:", error); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // 2. Filter Logic
  const filteredData = data.filter((item) => 
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.kategori_nama.toLowerCase().includes(search.toLowerCase())
  );

  const totalPage = Math.ceil(filteredData.length / limit);
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  // 3. Handlers
  const handleShowModal = (mode, item = null) => {
    setModalMode(mode);
    if (item) {
      const layananObj = layananList.find(l => l.id_BUsaha === item.kategori);
      const layananName = layananObj ? layananObj.nama_BUsaha : "";
      
      setForm({
        id: item.id,
        nama: item.nama,
        deskripsi: item.deskripsi,
        kategori: layananName, 
        foto: item.foto,
        foto_file: null,
        status: item.status || "active"
      });
    } else {
      setForm({ id: null, nama: "", deskripsi: "", kategori: "", foto: "", foto_file: null, status: "active" });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.kategori) {
      toast.warn("Nama dan Kategori Layanan wajib diisi");
      return;
    }

    const selectedLayanan = layananList.find(l => l.nama_BUsaha === form.kategori);
    if (!selectedLayanan) {
      toast.error("Layanan tidak valid");
      return;
    }

    let safeDeskripsi = form.deskripsi || "";
    if (safeDeskripsi.length < 10) safeDeskripsi += " (Deskripsi menyusul)";

    const payload = {
      nama: form.nama,
      deskripsi: safeDeskripsi,
      layanan_id: selectedLayanan.id_BUsaha, 
      gambar_file: form.foto_file,
      status: form.status || "active"
    };

    try {
      if (modalMode === "add") {
        await createPelatihan(payload);
        toast.success("Pelatihan berhasil ditambahkan");
      } else if (modalMode === "edit") {
        await updatePelatihan(form.id, payload);
        toast.success("Pelatihan berhasil diperbarui");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus pelatihan ini?")) {
      try {
        await deletePelatihan(id);
        toast.success("Pelatihan dihapus");
        loadData();
      } catch (error) {
        console.error(error); // PERBAIKAN: Variabel error digunakan di sini
        toast.error("Gagal menghapus data");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-4">
        <ToastContainer position="top-right" />
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Manajemen Pelatihan</h2>
            <p className="text-muted mb-0">Daftar Jenis Usaha & Training</p>
          </div>
          <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => handleShowModal("add")}>
            <Plus size={18} /> Tambah Pelatihan
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-3 rounded shadow-sm mb-4">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0"><Search size={18} className="text-muted" /></span>
            <input type="text" className="form-control border-start-0 ps-0" placeholder="Cari pelatihan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        {/* --- TAMPILAN TABEL --- */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 ps-4">No</th>
                    <th className="py-3">Foto</th>
                    <th className="py-3">Nama Pelatihan</th>
                    <th className="py-3">Kategori</th>
                    <th className="py-3">Deskripsi</th>
                    <th className="py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="ps-4">{(page - 1) * limit + index + 1}</td>
                        <td>
                          {item.foto ? <img src={item.foto} alt="" className="rounded" width="50" height="50" style={{objectFit:'cover'}} /> : <div className="bg-light rounded d-flex align-items-center justify-content-center text-muted" style={{width:50, height:50}}>No IMG</div>}
                        </td>
                        <td className="fw-medium">{item.nama}</td>
                        <td><span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">{item.kategori_nama}</span></td>
                        <td className="text-muted small"><div className="text-truncate" style={{maxWidth: 200}}>{item.deskripsi}</div></td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button variant="outline-info" size="sm" onClick={() => handleShowModal("view", item)}><Eye size={16} /></Button>
                            <Button variant="outline-warning" size="sm" onClick={() => handleShowModal("edit", item)}><Pen size={16} /></Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="text-center p-5 text-muted">Data kosong.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="p-3 border-top d-flex justify-content-between">
             <div/> <Pagination page={page} totalPage={totalPage} onPage={setPage} />
          </div>
        </div>

        <ModalPelatihan
          show={showModal}
          title={modalMode === "add" ? "Tambah Pelatihan" : modalMode === "edit" ? "Edit Pelatihan" : "Detail"}
          fields={[
            { name: "nama", label: "Nama Pelatihan", type: "text" },
            { name: "kategori", label: "Kategori (Layanan)", type: "select", options: layananList.map(l => l.nama_BUsaha) }, 
            { name: "deskripsi", label: "Deskripsi", type: "textarea", rows: 4 },
            { name: "foto", label: "Foto", type: "foto" },
            { name: "status", label: "Status", type: "select", options: ["active", "inactive"] },
          ]}
          value={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          readOnly={modalMode === "view"}
        />
      </div>
    </DashboardLayout>
  );
}

import React, { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CardItem from "../components/CardItem";
import ModalItem from "../components/ModalItem";
import Pagination from "../components/Pagination";
import { getLayanan, createLayanan, updateLayanan, deleteLayanan } from "../api/layananApi";
import { ToastContainer, toast } from "react-toastify";
import { Briefcase, ArrowUpDown, Plus } from "lucide-react";

// Helper URL Gambar
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://202.10.47.174:8000";

export default function Layanan() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" }); // Fitur Sort
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, nama: "", deskripsi: "", gambar: "", gambar_file: null });

  // 1. Load Data
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLayanan();
      const rawData = Array.isArray(res) ? res : (res.data || []);
      
      const mapped = rawData.map(item => ({
        ...item,
        id: item.id_BUsaha,
        nama: item.nama_BUsaha,
        deskripsi: item.deskripsi,
        // Gambar Backend
        gambar: item.poto ? (item.poto.startsWith("http") ? item.poto : `${BASE_URL}/${item.poto}`) : null
      }));
      setData(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // 2. Logic Sortir & Filter
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.nama.toLowerCase().includes(q));
    }

    // Sortir (Fitur khas Layanan)
    if (sort.key) {
      result.sort((a, b) => {
        const valA = (a[sort.key] || "").toString().toLowerCase();
        const valB = (b[sort.key] || "").toString().toLowerCase();
        if (valA < valB) return sort.dir === "asc" ? -1 : 1;
        if (valA > valB) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, search, sort]);

  const totalPage = Math.max(1, Math.ceil(processedData.length / limit));
  const paginated = processedData.slice((page - 1) * limit, page * limit);

  // 3. Handlers
  const changeSort = (key) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc"
    }));
  };

  const submit = async () => {
    if (!form.nama) { toast.warn("Nama layanan wajib diisi"); return; }
    
    // Trik Deskripsi
    let safeDeskripsi = form.deskripsi || "";
    if (safeDeskripsi.trim().length < 10) safeDeskripsi += " (Deskripsi layanan)";

    const payload = { ...form, deskripsi: safeDeskripsi };

    try {
      if (form.id) {
        await updateLayanan(form.id, payload);
        toast.success("Layanan diperbarui");
      } else {
        await createLayanan(payload);
        toast.success("Layanan ditambah");
      }
      setShow(false);
      load();
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus layanan ini?")) return;
    try {
      await deleteLayanan(id);
      toast.success("Layanan dihapus");
      load();
    } catch (e) {
      toast.error(e.message || "Gagal menghapus");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold d-flex align-items-center gap-2 mb-1">
              <Briefcase size={28} className="text-primary"/> Layanan
            </h2>
            <p className="text-muted mb-0">Kelola Bidang Usaha Utama</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { 
            setForm({ id: null, nama: "", deskripsi: "", gambar: "", gambar_file: null }); 
            setShow(true); 
          }}>
            <Plus size={18} /> Tambah Layanan
          </button>
        </div>

        {/* Toolbar: Search & Sort */}
        <div className="bg-white p-3 rounded shadow-sm mb-4 d-flex justify-content-between align-items-center">
          <input 
            className="form-control" style={{maxWidth: 300}}
            placeholder="Cari layanan..." 
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          />
          <button className={`btn btn-sm ${sort.key === 'nama' ? 'btn-info text-white' : 'btn-outline-secondary'} d-flex align-items-center gap-2`} onClick={() => changeSort("nama")}>
            <ArrowUpDown size={14} /> Urutkan Nama
          </button>
        </div>

        {/* --- TAMPILAN GRID KARTU (KHUSUS LAYANAN) --- */}
        {loading ? <div className="text-center p-5">Memuat data...</div> : (
          <div className="grid-cards">
            {paginated.map(it => (
              <CardItem 
                key={it.id} 
                variant="layanan" 
                item={it} 
                onEdit={() => { setForm(it); setShow(true); }} 
                onDelete={() => handleDelete(it.id)} 
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPage={totalPage} onPage={setPage} />

        {/* Modal Standar */}
        <ModalItem
          show={show}
          title={form.id ? "Edit Layanan" : "Tambah Layanan"}
          fields={[
            { name: "nama", label: "Nama Bidang Usaha", type: "text" },
            { name: "deskripsi", label: "Deskripsi", type: "textarea" },
            { name: "gambar", label: "Foto", type: "foto" }
          ]}
          value={form}
          onChange={setForm}
          onSubmit={submit}
          onClose={() => setShow(false)}
        />
        <ToastContainer position="top-right"/>
      </div>
    </DashboardLayout>
  );
}
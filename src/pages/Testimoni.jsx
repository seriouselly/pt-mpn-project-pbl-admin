import React, { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from '../components/layout/DashboardLayout';
import CardItem from "../components/CardItem";
import ModalItem from "../components/ModalItem";
import Pagination from "../components/Pagination";
import { getTestimoni, createTestimoni, updateTestimoni, deleteTestimoni } from "../api/testimoniApi";
import { ToastContainer, toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://202.10.47.174:8000";

export default function Testimoni() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, nama: "", testimoni: "", foto: "", foto_file: null });

  // Gunakan useCallback untuk load function
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTestimoni();
      const rawData = Array.isArray(res) ? res : (res.data || []);
      
      const mappedData = rawData.map(item => ({
        ...item,
        testimoni: item.pesan_testi, 
        foto: item.foto ? (item.foto.startsWith("http") ? item.foto : `${BASE_URL}/${item.foto}`) : null 
      }));
      setData(mappedData);
    } catch (e) {
      console.error(e);
      // toast.error("Gagal memuat testimoni"); // Silent error lebih baik saat init load
    } finally {
      setLoading(false);
    }
  }, []);

  // Panggil load() hanya sekali saat mount
  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return data.filter(d => !q || (d.nama || "").toLowerCase().includes(q));
  }, [data, search]);

  const totalPage = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const submit = async () => {
    if (!form.nama || !form.testimoni) { toast.warn("Nama & testimoni wajib diisi"); return; }
    try {
      if (form.id) {
        await updateTestimoni(form.id, form);
        toast.success("Diperbarui");
      } else {
        await createTestimoni(form);
        toast.success("Ditambah");
      }
      setShow(false);
      setForm({ id: null, nama: "", testimoni: "", foto: "", foto_file: null });
      load();
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus testimoni?")) return;
    try {
      await deleteTestimoni(id);
      toast.success("Dihapus");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <h2>Testimoni</h2>
            <div className="page-subtitle">Ulasan dari pengguna</div>
          </div>
          <button className="btn btn-primary" onClick={() => { setForm({ id: null, nama: "", testimoni: "", foto: "", foto_file: null }); setShow(true); }}>+ Tambah Testimoni</button>
        </div>

        <div className="mb-3">
          <input className="form-control" placeholder="Cari testimoni..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>

        {loading ? <div className="text-center p-5">Memuat data...</div> : (
          <div className="grid-cards">
            {paginated.map(it => (
              <CardItem key={it.id} variant="testimoni" item={it} onEdit={() => { setForm(it); setShow(true); }} onDelete={() => handleDelete(it.id)} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPage={totalPage} onPage={setPage} />

        <ModalItem show={show} title={form.id ? "Edit Testimoni" : "Tambah Testimoni"} fields={[{ name: "nama", label: "Nama", type: "text" }, { name: "testimoni", label: "Testimoni", type: "textarea", rows: 3 }, { name: "foto", label: "Foto", type: "foto" }]} value={form} onChange={setForm} onSubmit={submit} onClose={() => setShow(false)} />
        <ToastContainer position="top-right" />
      </div>
    </DashboardLayout>
  );
}
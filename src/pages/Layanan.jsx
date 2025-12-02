import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from '../components/layout/DashboardLayout';
import CardItem from "../components/CardItem";
import ModalItem from "../components/ModalItem";
import Pagination from "../components/Pagination";
import { getLayanan, createLayanan, updateLayanan, deleteLayanan, resetDatabase } from "../api/layananApi";
import { ToastContainer, toast } from "react-toastify";

export default function LayananLayanan() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  // modal + form
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, nama: "", deskripsi: "", status: "Active", foto: "" });

  const load = async () => {
    const res = await getLayanan();
    setData(res.data || []);
  };
  useEffect(() => { load(); }, []);

  // filtering
  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return data.filter(d => !q || (d.nama || "").toLowerCase().includes(q) || (d.deskripsi || "").toLowerCase().includes(q));
  }, [data, search]);

  // sorting
  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const s = [...filtered].sort((a, b) => {
      const A = (a[sort.key] || "").toString().toLowerCase();
      const B = (b[sort.key] || "").toString().toLowerCase();
      if (A < B) return sort.dir === "asc" ? -1 : 1;
      if (A > B) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return s;
  }, [filtered, sort]);

  const totalPage = Math.max(1, Math.ceil(sorted.length / limit));
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  const changeSort = (key) => {
    setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async () => {
    if (!form.nama || !form.deskripsi) { toast.warn("Nama & deskripsi wajib"); return; }

    const payload = { ...form };

    if (form.foto_file) {
      try {
        payload.foto = await toBase64(form.foto_file);
      } catch (e) {
        console.error(e);
      }
      delete payload.foto_file;
    }

    if (form.id) {
      await updateLayanan(form.id, payload); toast.success("Diperbarui");
    } else {
      await createLayanan(payload); toast.success("Ditambah");
    }
    setShow(false); setForm({ id: null, nama: "", deskripsi: "", status: "Active", foto: "" }); load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus layanan?")) return;
    await deleteLayanan(id); toast.success("Dihapus"); load();
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <h2>Manajemen Layanan</h2>
            <div className="page-subtitle">Kelola layanan yang ditawarkan</div>
          </div>

          <div>
            <button className="btn btn-primary" onClick={() => { setForm({ id: null, nama: "", deskripsi: "", status: "Active", foto: "" }); setShow(true); }}>+ Tambah Layanan</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <input className="form-control" placeholder="Cari layanan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: 420 }} />
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button className="btn btn-outline" onClick={() => { changeSort("nama"); }}>Sort Nama</button>
            <button className="btn btn-outline" onClick={() => { changeSort("status"); }}>Sort Status</button>
            <button className="btn btn-danger" onClick={async () => { if (!confirm("Reset DB?")) return; await resetDatabase(); toast.success("DB direset"); load(); }}>Reset Database</button>
          </div>
        </div>

        <div className="grid-cards">
          {paginated.map(it => (
            <CardItem key={it.id} variant="layanan" item={it} onEdit={() => { setForm(it); setShow(true); }} onDelete={() => handleDelete(it.id)} />
          ))}
        </div>

        <Pagination page={page} totalPage={totalPage} onPage={(p) => setPage(p)} />

        <ModalItem
          show={show}
          title={form.id ? "Edit Layanan" : "Tambah Layanan"}
          fields={[
            { name: "nama", label: "Nama Layanan", type: "text" },
            { name: "deskripsi", label: "Deskripsi", type: "textarea", rows: 4 },
            { name: "foto", label: "Foto Layanan", type: "foto" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
          ]}
          value={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => setShow(false)}
        />

        <ToastContainer position="top-right" />
      </div>
    </DashboardLayout>
  );
}

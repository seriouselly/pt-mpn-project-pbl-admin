import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from '../components/layout/DashboardLayout';
import CardItem from "../components/CardItem";
import ModalItem from "../components/ModalItem";
import Pagination from "../components/Pagination";
import { getTestimoni, createTestimoni, updateTestimoni, deleteTestimoni } from "../api/testimoniApi";
import { ToastContainer, toast } from "react-toastify";

export default function TestimoniTestimoni() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, nama: "", testimoni: "", foto: "" });

  const load = async () => { const res = await getTestimoni(); setData(res.data || []); };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return data.filter(d => !q || (d.nama || "").toLowerCase().includes(q) || (d.testimoni || "").toLowerCase().includes(q));
  }, [data, search]);

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

  const submit = async () => {
    if (!form.nama || !form.testimoni) { toast.warn("Nama & testimoni wajib"); return; }
    if (form.id) { await updateTestimoni(form.id, form); toast.success("Diperbarui"); }
    else { await createTestimoni(form); toast.success("Ditambah"); }
    setShow(false); setForm({ id: null, nama: "", testimoni: "", foto: "" }); load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus testimoni?")) return;
    await deleteTestimoni(id); toast.success("Dihapus"); load();
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <h2>Testimoni</h2>
            <div className="page-subtitle">Ulasan dari pengguna</div>
          </div>

          <div>
            <button className="btn btn-primary" onClick={() => { setForm({ id: null, nama: "", testimoni: "", foto: "" }); setShow(true); }}>+ Tambah Testimoni</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <input className="form-control" placeholder="Cari testimoni..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: 420 }} />
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button className="btn btn-outline" onClick={() => changeSort("nama")}>Sort Nama</button>
            <button className="btn btn-outline" onClick={() => changeSort("testimoni")}>Sort Testimoni</button>
          </div>
        </div>

        <div className="grid-cards">
          {paginated.map(it => (
            <CardItem key={it.id} variant="testimoni" item={it} onEdit={() => { setForm(it); setShow(true); }} onDelete={() => handleDelete(it.id)} />
          ))}
        </div>

        <Pagination page={page} totalPage={totalPage} onPage={(p) => setPage(p)} />

        <ModalItem
          show={show}
          title={form.id ? "Edit Testimoni" : "Tambah Testimoni"}
          fields={[
            { name: "nama", label: "Nama", type: "text" },
            { name: "testimoni", label: "Testimoni", type: "textarea", rows: 3 },
            { name: "foto", label: "Foto (URL)", type: "text" }
          ]}
          value={form}
          onChange={setForm}
          onSubmit={submit}
          onClose={() => setShow(false)}
        />

        <ToastContainer position="top-right" />
      </div>
    </DashboardLayout>
  );
}

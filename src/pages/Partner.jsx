import React, { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CardItem from "../components/CardItem";
import ModalItem from "../components/ModalItem";
import Pagination from "../components/Pagination";
import { getPartners, createPartner, updatePartner, deletePartner } from "../api/partnerApi";
import { ToastContainer, toast } from "react-toastify";
import { Handshake, Plus } from "lucide-react";
import { resolveUploadUrl } from "../utils/url";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://202.10.47.174:8000";

export default function Partner() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, nama: "", deskripsi: "", foto: "", foto_file: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPartners();
      const mapped = (res || []).map((item) => ({
        id: item.id,
        nama: item.nama_partner,
        deskripsi: item.deskripsi,
        foto: resolveUploadUrl(BASE_URL, item.logo),
      }));
      setData(mapped);
    } catch (e) {
      console.error(e);
      toast.error("Gagal memuat partner");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return data.filter((d) => !q || (d.nama || "").toLowerCase().includes(q));
  }, [data, search]);

  const totalPage = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const submit = async () => {
    if (!form.nama) { toast.warn("Nama partner wajib diisi"); return; }
    if (!form.deskripsi || form.deskripsi.length < 10) { toast.warn("Deskripsi minimal 10 karakter"); return; }
    if (!form.id && !form.foto_file) { toast.warn("Logo wajib diunggah"); return; }
    try {
      if (form.id) {
        await updatePartner(form.id, { nama: form.nama, deskripsi: form.deskripsi, foto_file: form.foto_file });
        toast.success("Partner diperbarui");
      } else {
        await createPartner({ nama: form.nama, deskripsi: form.deskripsi, foto_file: form.foto_file });
        toast.success("Partner ditambah");
      }
      setShow(false);
      setForm({ id: null, nama: "", deskripsi: "", foto: "", foto_file: null });
      load();
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan partner");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus partner ini?")) return;
    try {
      await deletePartner(id);
      toast.success("Partner dihapus");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus partner");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold d-flex align-items-center gap-2">
              <Handshake size={26} className="text-primary" /> Partner
            </h2>
            <p className="text-muted mb-0">Kelola logo dan deskripsi partner</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setForm({ id: null, nama: "", deskripsi: "", foto: "", foto_file: null }); setShow(true); }}>
            <Plus size={18} /> Tambah Partner
          </button>
        </div>

        <div className="mb-3">
          <input className="form-control" placeholder="Cari partner..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>

        {loading ? <div className="text-center p-5">Memuat data...</div> : (
          <div className="grid-cards">
            {paginated.map(it => (
              <CardItem key={it.id} variant="partner" item={it} onEdit={() => { setForm({ ...it, foto_file: null }); setShow(true); }} onDelete={() => handleDelete(it.id)} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPage={totalPage} onPage={setPage} />

        <ModalItem
          show={show}
          title={form.id ? "Edit Partner" : "Tambah Partner"}
          fields={[
            { name: "nama", label: "Nama Partner", type: "text" },
            { name: "deskripsi", label: "Deskripsi", type: "textarea" },
            { name: "foto", label: "Logo", type: "foto" }
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

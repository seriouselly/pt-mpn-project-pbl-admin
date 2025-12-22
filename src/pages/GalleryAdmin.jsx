import React, { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CardItem from "../components/CardItem";
import ModalItem from "../components/ModalItem";
import Pagination from "../components/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { Image as ImageIcon, Images, Plus } from "lucide-react";
import { getGallery, createGallery, updateGallery, deleteGallery } from "../api/galleryApi";
import { resolveUploadUrl } from "../utils/url";
import { useAuth } from "../contexts/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://202.10.47.174:8000";

export default function GalleryAdmin() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, judul: "", deskripsi: "", foto: "", foto_file: null });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getGallery();
      const mapped = (res || []).map((item) => ({
        ...item,
        id: item.id || item.id_gallery || item._id,
        nama: item.judul || item.title || item.nama || "Galeri",
        deskripsi: item.deskripsi || item.keterangan || "",
        foto: resolveUploadUrl(BASE_URL, item.image || item.foto || item.poto || item.url),
      }));
      setItems(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => !q || (it.nama || "").toLowerCase().includes(q));
  }, [items, search]);

  const totalPage = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const handleSubmit = async () => {
    if (!form.id && !form.foto_file) {
      toast.warn("Gambar wajib diunggah");
      return;
    }

    if (!user?.id) {
      toast.error("User login tidak terdeteksi, silakan login ulang");
      return;
    }

    const payload = {
      foto_file: form.foto_file,
      image_file: form.foto_file,
      id_users: user?.id || user?._id || user?.id_users,
    };

    try {
      if (form.id) {
        await updateGallery(form.id, payload);
        toast.success("Galeri diperbarui");
      } else {
        await createGallery(payload);
        toast.success("Galeri ditambahkan");
      }
      setShowModal(false);
      setForm({ id: null, judul: "", deskripsi: "", foto: "", foto_file: null });
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gagal menyimpan galeri");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus item galeri ini?")) return;
    try {
      await deleteGallery(id);
      toast.success("Galeri dihapus");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus galeri");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold fs-3 d-flex align-items-center gap-2 mb-1">
              <Images size={28} className="text-primary" /> Galeri
            </h2>
            <p className="text-muted mb-0">Kelola foto-foto yang tampil di website</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setForm({ id: null, judul: "", deskripsi: "", foto: "", foto_file: null }); setShowModal(true); }}>
            <Plus size={18} /> Tambah Galeri
          </button>
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Cari galeri..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {loading ? (
          <div className="text-center p-5">Memuat galeri...</div>
        ) : (
          <div className="grid-cards">
            {paginated.map((it) => (
              <CardItem
                key={it.id}
                variant="gallery"
                item={it}
                onEdit={() => { setForm({ ...it, judul: it.nama, foto_file: null }); setShowModal(true); }}
                onDelete={() => handleDelete(it.id)}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPage={totalPage} onPage={setPage} />

        <ModalItem
          show={showModal}
          title={form.id ? "Edit Galeri" : "Tambah Galeri"}
          fields={[
            { name: "foto", label: "Gambar (wajib)", type: "foto" },
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

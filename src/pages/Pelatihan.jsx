import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button, Spinner } from "react-bootstrap";
import { Eye, Trash2, Pen, RotateCw } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getPelatihan,
  createPelatihan,
  updatePelatihan,
  deletePelatihan,
  resetDatabase,
} from "../api/pelatihanApi";

import ModalPelatihan from "../components/ModalPelatihan";
import Pagination from "../components/Pagination";

import "../styles/pages/Pelatihan.css";

export default function Pelatihan() {
  // data + loading
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // search / sort / pagination
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "nama", dir: "asc" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  // modal/form state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [form, setForm] = useState({
    id: null,
    foto: "",
    foto_file: null,
    nama: "",
    deskripsi: "",
    kategori: "",
    jenis: "",
    status: "Active",
  });
  const [selectedView, setSelectedView] = useState(null);

  // load data
  const load = async () => {
    setLoading(true);
    try {
      const res = await getPelatihan();
      setData(res.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // search + filter
  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (d) =>
        (d.nama || "").toLowerCase().includes(q) ||
        (d.deskripsi || "").toLowerCase().includes(q) ||
        (d.kategori || "").toLowerCase().includes(q)
    );
  }, [data, search]);

  // sort
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

  // pagination calculations
  const totalPage = Math.max(1, Math.ceil(sorted.length / limit));
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  // change sort
  const changeSort = (key) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  // modal handlers
  const openAdd = () => {
    setModalMode("add");
    setForm({
      id: null,
      foto: "",
      foto_file: null,
      nama: "",
      deskripsi: "",
      kategori: "",
      jenis: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setModalMode("edit");
    setForm({
      ...item,
      foto_file: null, // reset file object
    });
    setShowModal(true);
  };

  const openView = (item) => {
    setModalMode("view");
    setSelectedView(item);
    setForm(item);
    setShowModal(true);
  };

  // toBase64 util
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // submit handler (create/update)
  const handleSubmit = async () => {
    // basic validation
    if (!form.nama?.trim() || !form.deskripsi?.trim()) {
      toast.warn("Nama dan deskripsi wajib diisi");
      return;
    }

    try {
      const payload = { ...form };
      // if there's a file, convert to base64 string before saving
      if (form.foto_file) {
        payload.foto = await toBase64(form.foto_file);
        delete payload.foto_file;
      }

      if (form.id) {
        await updatePelatihan(form.id, payload);
        toast.success("Pelatihan diperbarui");
      } else {
        await createPelatihan(payload);
        toast.success("Pelatihan ditambahkan");
      }
      setShowModal(false);
      load();
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan data");
    }
  };

  // delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pelatihan ini?")) return;
    try {
      await deletePelatihan(id);
      toast.success("Pelatihan dihapus");
      // if current page empty after delete, go previous page
      const nextData = data.filter((d) => d.id !== id);
      const nextTotalPage = Math.max(1, Math.ceil(nextData.length / limit));
      if (page > nextTotalPage) setPage(nextTotalPage);
      load();
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus");
    }
  };

  // reset DB
  const handleResetDatabase = async () => {
    if (!window.confirm("Reset database ke data awal (training.js)?")) return;
    try {
      await resetDatabase();
      toast.success("Database di-reset");
      setPage(1);
      setSearch("");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Gagal reset database");
    }
  };

  // UI
  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold">Manajemen Pelatihan</h2>
            <p className="text-muted mb-0">Kelola program pelatihan</p>
          </div>

          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={handleResetDatabase} title="Reset Database">
              <RotateCw size={16} /> Reset DB
            </Button>

            <Button variant="primary" onClick={openAdd}>
              + Tambah Pelatihan
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="d-flex gap-2 mb-3 align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Cari nama / deskripsi / kategori..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="form-select w-auto"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={8}>8 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-responsive bg-white rounded shadow-sm">
          {loading ? (
            <div className="p-4 text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "30%", cursor: "pointer" }} onClick={() => changeSort("nama")}>
                    Nama Pelatihan {sort.key === "nama" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th style={{ width: "55%" }}>Deskripsi</th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center p-4 text-muted">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  paginated.map((item) => (
                    <tr key={item.id}>
                      <td className="align-middle">
                        <div className="fw-semibold">{item.nama || item.title}</div>
                        <small className="text-muted">{item.kategori}</small>
                      </td>
                      <td className="align-middle">{(item.deskripsi || item.desc || "").slice(0, 160)}</td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openView(item)} title="Lihat">
                            <Eye size={16} />
                          </button>
                          <button className="btn btn-sm btn-outline-warning" onClick={() => openEdit(item)} title="Edit">
                            <Pen size={16} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)} title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination component */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Menampilkan {Math.min((page - 1) * limit + 1, sorted.length)} - {Math.min(page * limit, sorted.length)} dari {sorted.length}
          </div>
          <Pagination page={page} totalPage={totalPage} onPage={(p) => setPage(p)} />
        </div>

        {/* Modal */}
        <ModalPelatihan
          show={showModal}
          title={modalMode === "add" ? "Tambah Pelatihan" : modalMode === "edit" ? "Edit Pelatihan" : "Detail Pelatihan"}
          fields={[
            { name: "title", label: "Nama Pelatihan", type: "text" },
            { name: "desc", label: "Deskripsi", type: "textarea", rows: 4 },
            { name: "category", label: "Kategori", type: "select", options: ["non-formal", "keterampilan-kerja"] },
            { name: "image", label: "Foto (preview)", type: "foto" },
            { name: "jenis", label: "Jenis Pelatihan", type: "textarea", rows: 2 },
            { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
          ]}
          value={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          readOnly={modalMode === "view"}
        />

        <ToastContainer position="top-right" />
      </div>
    </DashboardLayout>
  );
}

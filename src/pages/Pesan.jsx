import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Eye, Trash2, X, Search, Mail, Tag, MessagesSquare } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; // Tambahkan notifikasi
import "../styles/pages/Pesan.css";
import { deletePesan, getPesan, updatePesan } from "../api/pesanApi";

const Pesan = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Data dari API Backend
  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getPesan();
      const normalized = (data || []).map((msg) => ({
        ...msg,
        status: msg.status || "pending",
      }));
      setMessages(normalized);
    } catch (error) {
      console.error("Gagal mengambil pesan:", error);
      toast.error("Gagal memuat pesan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // 2. Logic Filter Search (Client Side)
  const filteredMessages = messages.filter((msg) => {
    const term = searchTerm.toLowerCase();
    return (
      (msg.name_pesan || "").toLowerCase().includes(term) ||
      (msg.email_pesan || "").toLowerCase().includes(term) ||
      (msg.pesan_isi || "").toLowerCase().includes(term) ||
      (msg.layanan_pesan || "").toLowerCase().includes(term)
    );
  });

  // 3. Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // 4. Handler Modal
  const handleView = (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMessage(null), 200);
  };

  // Handler untuk balas pesan via Gmail
  const handleReplyMessage = (msg) => {
    const subject = `Re: Pesan dari ${msg.name_pesan} - ${msg.layanan_pesan}`;
    const body = `Kepada ${msg.name_pesan} (${msg.email_pesan}),\n\n[Tulis balasan Anda di sini]\n\n---\nPesan asli:\n${msg.pesan_isi}`;

    // Buka Gmail di tab baru
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ptmultiarthapundimasnawasena@gmail.com&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  // 5. Handler Update & Hapus Pesan (API)
  const handleStatusUpdate = async (id, status) => {
    try {
      await updatePesan(id, status);
      setMessages((prev) =>
        prev.map((msg) => (msg.id_pesan === id ? { ...msg, status } : msg))
      );
      toast.success("Status pesan diperbarui");
    } catch (error) {
      console.error("Gagal memperbarui status pesan:", error);
      toast.error("Gagal memperbarui status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      try {
        await deletePesan(id);
        toast.success("Pesan berhasil dihapus");
        loadMessages(); // Reload data
      } catch (error) {
        console.error("Gagal menghapus pesan:", error);
        toast.error("Gagal menghapus pesan.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="mb-4">
          <h2 className="fw-bold fs-3 d-flex align-items-center gap-2 mb-1">
            <MessagesSquare size={28} className="text-primary" /> Pesan Kontak</h2>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">
              Kelola pesan masuk dari pengunjung website
            </span>
            <span className="badge bg-primary rounded-pill">
              {messages.length} total pesan
            </span>
          </div>
        </div>

        <div className="pesan-container">
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-input w-100"
              placeholder="Cari nama, email, layanan, atau isi pesan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th style={{ width: "15%" }}>Pengirim</th>
                  <th style={{ width: "15%" }}>Layanan</th>
                  <th style={{ width: "20%" }}>Pesan</th>
                  <th style={{ width: "15%" }}>Waktu</th>
                  <th style={{ width: "18%" }}>Status</th>
                  <th style={{ width: "8%" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-5">
                      Memuat pesan...
                    </td>
                  </tr>
                ) : filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-5">
                      Tidak ada pesan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg, index) => (
                    <tr key={msg.id_pesan || index}>
                      <td className="ps-4">
                        <Mail size={18} className="text-secondary" />
                      </td>
                      <td>
                        <span className="pesan-sender">{msg.name_pesan}</span>
                        <span className="pesan-email">{msg.email_pesan}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1 fw-normal">
                          {msg.layanan_pesan}
                        </span>
                      </td>
                      <td>
                        <div className="pesan-preview">{msg.pesan_isi}</div>
                      </td>
                      <td className="text-muted fs-7">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={msg.status || "pending"}
                          onChange={(e) =>
                            handleStatusUpdate(msg.id_pesan, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="dibaca">Dibaca</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary border-0 p-1"
                            onClick={() => handleView(msg)}
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger border-0 p-1"
                            onClick={() => handleDelete(msg.id_pesan)}
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Detail */}
        <div
          className={`modal-overlay-custom ${isModalOpen ? "open" : ""}`}
          onClick={handleCloseModal}
        >
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h4 className="m-0 fw-bold">Detail Pesan</h4>
              <button
                className="btn btn-link text-dark p-0"
                onClick={handleCloseModal}
              >
                <X size={24} />
              </button>
            </div>

            {selectedMessage && (
              <div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="detail-label">Nama Pengirim</div>
                    <div className="detail-value fw-semibold">
                      {selectedMessage.name_pesan}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-label">Email</div>
                    <div className="detail-value text-primary">
                      {selectedMessage.email_pesan}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="detail-label">Layanan / Topik</div>
                    <div className="detail-value d-flex align-items-center gap-2">
                      <Tag size={16} className="text-muted" />{" "}
                      {selectedMessage.layanan_pesan}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-label">Waktu Diterima</div>
                    <div className="detail-value">
                      {formatDate(selectedMessage.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="detail-label">Isi Pesan</div>
                <div
                  className="detail-value bg-light p-3 rounded"
                  style={{ lineHeight: "1.6", whiteSpace: "pre-wrap" }}
                >
                  {selectedMessage.pesan_isi}
                </div>
                <div className="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Tutup
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleReplyMessage(selectedMessage)}
                  >
                    Balas Pesan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pesan;

import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Eye, Trash2, X, Search, Mail } from "lucide-react";
import "../styles/pages/Pesan.css";

const Pesan = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State untuk Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Data (Simulasi DB)
  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockMessages = [
        { id: 1, name: "Budi Santoso", email: "budi.santoso@company.com", content: "Saya tertarik dengan program pelatihan manajemen keuangan. Bisa tolong kirimkan informasi lebih detail mengenai jadwal dan biaya?", date: "2024-04-15 10:30", isRead: false },
        { id: 2, name: "Siti Rahayu", email: "siti.rahayu@email.com", content: "Apakah ada program pelatihan untuk karyawan level staff? Kami memiliki sekitar 20 peserta yang ingin didaftarkan.", date: "2024-04-14 14:20", isRead: false },
        { id: 3, name: "Ahmad Wijaya", email: "ahmad.w@enterprise.co.id", content: "Perusahaan kami ingin mengadakan in-house training untuk digital marketing. Mohon info lebih lanjut mengenai prosedurnya.", date: "2024-04-13 09:15", isRead: true },
        { id: 4, name: "Dewi Kusuma", email: "dewi.kusuma@startup.id", content: "Apakah tersedia paket khusus untuk startup? Kami membutuhkan konsultasi bisnis untuk pengembangan produk.", date: "2024-04-12 16:45", isRead: false }, // Highlighted in screenshot
        { id: 5, name: "Rudi Hartono", email: "rudi.h@corporation.com", content: "Terima kasih atas pelatihannya minggu lalu. Sangat bermanfaat! Apakah ada program lanjutan untuk level advanced?", date: "2024-04-11 11:00", isRead: true },
      ];
      setMessages(mockMessages);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 2. Logic Filter Search
  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Handler Buka Modal
  const handleView = (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    
    // Update status menjadi 'read' di lokal (Nanti kirim API update)
    if (!msg.isRead) {
      const updatedMessages = messages.map(m => 
        m.id === msg.id ? { ...m, isRead: true } : m
      );
      setMessages(updatedMessages);
    }
  };

  // 4. Handler Tutup Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMessage(null), 200); // Delay biar animasi smooth
  };

  // 5. Handler Hapus Pesan
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      // Nanti: await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      setMessages(messages.filter(msg => msg.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Pesan Kontak</h2>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Kelola pesan dari pengunjung website</span>
            {messages.filter(m => !m.isRead).length > 0 && (
              <span className="badge bg-warning text-dark rounded-pill">
                {messages.filter(m => !m.isRead).length} pesan baru
              </span>
            )}
          </div>
        </div>

        {/* --- Tabel Pesan --- */}
        <div className="pesan-container">
          {/* Search Bar */}
          <div className="search-bar-wrapper">
            <input 
              type="text" 
              className="search-input w-100" 
              placeholder="Cari pesan berdasarkan nama, email, atau isi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table Content */}
          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{width: '5%'}}>#</th>
                  <th style={{width: '25%'}}>Pengirim</th>
                  <th style={{width: '45%'}}>Pesan</th>
                  <th style={{width: '15%'}}>Tanggal</th>
                  <th style={{width: '10%'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center p-5">Memuat pesan...</td></tr>
                ) : filteredMessages.length === 0 ? (
                  <tr><td colSpan="5" className="text-center p-5">Tidak ada pesan ditemukan.</td></tr>
                ) : (
                  filteredMessages.map((msg, index) => (
                    <tr key={msg.id} className={!msg.isRead ? "pesan-unread" : ""}>
                      <td className="ps-4">
                        <Mail size={18} className={!msg.isRead ? "text-warning" : "text-muted"} />
                      </td>
                      <td>
                        <span className="pesan-sender">{msg.name}</span>
                        <span className="pesan-email">{msg.email}</span>
                      </td>
                      <td>
                        <div className="pesan-preview">{msg.content}</div>
                      </td>
                      <td className="text-muted fs-7">{msg.date}</td>
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
                            onClick={() => handleDelete(msg.id)}
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

        {/* --- Modal Detail Pesan --- */}
        <div className={`modal-overlay-custom ${isModalOpen ? 'open' : ''}`} onClick={handleCloseModal}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h4 className="m-0 fw-bold">Detail Pesan</h4>
              <button className="btn btn-link text-dark p-0" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            {selectedMessage && (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="detail-label">Nama Pengirim</div>
                    <div className="detail-value fw-semibold">{selectedMessage.name}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-label">Email</div>
                    <div className="detail-value text-primary">{selectedMessage.email}</div>
                  </div>
                </div>

                <div className="detail-label">Tanggal</div>
                <div className="detail-value">{selectedMessage.date}</div>

                <div className="detail-label">Isi Pesan</div>
                <div className="detail-value bg-light p-3 rounded" style={{ lineHeight: '1.6' }}>
                  {selectedMessage.content}
                </div>

                <div className="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                  <button className="btn btn-secondary" onClick={handleCloseModal}>Tutup</button>
                  <a href={`mailto:${selectedMessage.email}`} className="btn btn-primary">Balas Pesan</a>
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
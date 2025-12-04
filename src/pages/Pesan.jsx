import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Eye, Trash2, X, Search, Mail, Tag } from "lucide-react"; // Nambah icon Tag untuk layanan
import "../styles/pages/Pesan.css";

const Pesan = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State untuk Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Data (Simulasi Struktur Backend PostgreSQL)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Nanti diganti dengan: const res = await fetch('http://localhost:5000/api/pesan');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock Data Sesuai Prisma Model
        const mockMessages = [
          { 
            id_pesan: "uuid-1", 
            name_pesan: "Budi Santoso", 
            email_pesan: "budi.santoso@company.com", 
            pesan_isi: "Saya tertarik dengan program pelatihan manajemen keuangan. Bisa tolong kirimkan informasi lebih detail mengenai jadwal dan biaya?", 
            layanan_pesan: "Pelatihan & Sertifikasi",
            createdAt: "2024-04-15T10:30:00Z" 
          },
          { 
            id_pesan: "uuid-2", 
            name_pesan: "Siti Rahayu", 
            email_pesan: "siti.rahayu@email.com", 
            pesan_isi: "Apakah ada program pelatihan untuk karyawan level staff? Kami memiliki sekitar 20 peserta yang ingin didaftarkan.", 
            layanan_pesan: "In-House Training",
            createdAt: "2024-04-14T14:20:00Z" 
          },
          { 
            id_pesan: "uuid-3", 
            name_pesan: "Ahmad Wijaya", 
            email_pesan: "ahmad.w@enterprise.co.id", 
            pesan_isi: "Perusahaan kami ingin mengadakan konsultasi untuk transformasi digital marketing.", 
            layanan_pesan: "Konsultansi Manajemen",
            createdAt: "2024-04-13T09:15:00Z" 
          },
          { 
            id_pesan: "uuid-4", 
            name_pesan: "Dewi Kusuma", 
            email_pesan: "dewi.kusuma@startup.id", 
            pesan_isi: "Apakah tersedia paket khusus untuk startup? Kami membutuhkan konsultasi bisnis.", 
            layanan_pesan: "Konsultansi Manajemen",
            createdAt: "2024-04-12T16:45:00Z" 
          },
          { 
            id_pesan: "uuid-5", 
            name_pesan: "Rudi Hartono", 
            email_pesan: "rudi.h@corporation.com", 
            pesan_isi: "Terima kasih atas pelatihannya minggu lalu. Sangat bermanfaat! Apakah ada program lanjutan?", 
            layanan_pesan: "Pelatihan & Sertifikasi",
            createdAt: "2024-04-11T11:00:00Z" 
          },
        ];
        
        // Sorting berdasarkan tanggal terbaru (Newest First)
        const sortedMessages = mockMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setMessages(sortedMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Logic Filter Search
  const filteredMessages = messages.filter(msg => 
    msg.name_pesan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email_pesan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.pesan_isi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.layanan_pesan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Format Tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // 4. Handler Buka Modal
  const handleView = (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
  };

  // 5. Handler Tutup Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMessage(null), 200); 
  };

  // 6. Handler Hapus Pesan
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      try {
        // Nanti ganti: await fetch(`http://localhost:5000/api/pesan/${id}`, { method: 'DELETE' });
        setMessages(messages.filter(msg => msg.id_pesan !== id));
      } catch (error) {
        console.error("Gagal menghapus pesan:", error);
        alert("Gagal menghapus pesan.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Pesan Kontak</h2>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Kelola pesan masuk dari pengunjung website</span>
            <span className="badge bg-primary rounded-pill">
              {messages.length} total pesan
            </span>
          </div>
        </div>

        {/* --- Tabel Pesan --- */}
        <div className="pesan-container">
          {/* Search Bar */}
          <div className="search-bar-wrapper">
            <input 
              type="text" 
              className="search-input w-100" 
              placeholder="Cari nama, email, layanan, atau isi pesan..."
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
                  <th style={{width: '20%'}}>Layanan</th>
                  <th style={{width: '35%'}}>Pesan</th>
                  <th style={{width: '15%'}}>Waktu</th>
                  <th style={{width: '10%'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center p-5">Memuat pesan...</td></tr>
                ) : filteredMessages.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-5">Tidak ada pesan ditemukan.</td></tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr key={msg.id_pesan}>
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
                      <td className="text-muted fs-7">{formatDate(msg.createdAt)}</td>
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
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="detail-label">Nama Pengirim</div>
                    <div className="detail-value fw-semibold">{selectedMessage.name_pesan}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-label">Email</div>
                    <div className="detail-value text-primary">{selectedMessage.email_pesan}</div>
                  </div>
                </div>

                <div className="row mb-3">
                   <div className="col-md-6">
                    <div className="detail-label">Layanan / Topik</div>
                    <div className="detail-value d-flex align-items-center gap-2">
                      <Tag size={16} className="text-muted"/> 
                      {selectedMessage.layanan_pesan}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-label">Waktu Diterima</div>
                    <div className="detail-value">{formatDate(selectedMessage.createdAt)}</div>
                  </div>
                </div>

                <div className="detail-label">Isi Pesan</div>
                <div className="detail-value bg-light p-3 rounded" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.pesan_isi}
                </div>

                <div className="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                  <button className="btn btn-secondary" onClick={handleCloseModal}>Tutup</button>
                  <a href={`mailto:${selectedMessage.email_pesan}`} className="btn btn-primary">Balas Pesan</a>
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
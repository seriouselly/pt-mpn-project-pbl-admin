import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { 
  GraduationCap, 
  Briefcase, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  MessageCircle,
  Clock
} from "lucide-react";
import "../styles/pages/Dashboard.css";

const Dashboard = () => {
  // 1. STATE: Siapkan tempat penampungan data (seperti dari Database)
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. EFFECT: Simulasi Fetch Data (Nanti diganti API Call)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- Simulasi loading jaringan (misal: menunggu response PostgreSQL) ---
        await new Promise(resolve => setTimeout(resolve, 1500));

        // --- Mock Data: Ini struktur JSON yang nanti didapat dari Backend ---
        const mockDbResponse = {
          stats: {
            pelatihan: { total: 5, active: 3 },
            layanan: { total: 5, active: 4 },
            pesan: { total: 5, unread: 2 },
            testimoni: { total: 4, published: 3 }
          },
          recentMessages: [
            { id: 1, user: "Budi Santoso", content: "Saya tertarik dengan program pelatihan manajemen keuangan. Bisa tolong kirimkan silabus lengkapnya?", time: "Baru saja" },
            { id: 2, user: "Siti Rahayu", content: "Apakah ada program pelatihan untuk karyawan level staff? Kami memiliki 15 orang tim.", time: "2 jam lalu" },
            { id: 3, user: "Ahmad Wijaya", content: "Perusahaan kami ingin mengadakan in-house training untuk digital marketing.", time: "1 hari lalu" }
          ],
          recentTrainings: [
            { id: 101, title: "Manajemen Keuangan Perusahaan", category: "Keuangan", duration: "3 Hari (24 Jam)", status: "Publish" },
            { id: 102, title: "Leadership & Management Excellence", category: "Leadership", duration: "5 Hari (40 Jam)", status: "Publish" },
            { id: 103, title: "Digital Marketing Strategy", category: "Marketing", duration: "2 Hari (16 Jam)", status: "Draft" }
          ]
        };

        setDashboardData(mockDbResponse);
        setLoading(false);
        
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. RENDER: Tampilan Loading
  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Memuat data dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  // 4. RENDER: Tampilan Utama (Setelah data dimuat)
  return (
    <DashboardLayout>
      <div className="container-fluid p-0 dashboard-container">
        
        {/* --- Header Section --- */}
        <div className="dashboard-header mb-4">
          <h2>Dashboard</h2>
          <p>Selamat datang di Admin Dashboard PT MPN</p>
        </div>

        {/* --- Statistik Cards --- */}
        <div className="row g-4 mb-4">
          {/* Card 1: Pelatihan */}
          <div className="col-12 col-md-6 col-xl-3">
            <div className="stat-card-clean">
              <div className="stat-header">
                <span className="stat-label">Total Pelatihan</span>
                <div className="stat-icon-wrapper bg-blue-soft">
                  <GraduationCap size={22} />
                </div>
              </div>
              <div className="stat-body">
                <h3>{dashboardData.stats.pelatihan.total}</h3>
                <span className="stat-subtext">{dashboardData.stats.pelatihan.active} aktif/publish</span>
              </div>
            </div>
          </div>

          {/* Card 2: Layanan */}
          <div className="col-12 col-md-6 col-xl-3">
            <div className="stat-card-clean">
              <div className="stat-header">
                <span className="stat-label">Total Layanan</span>
                <div className="stat-icon-wrapper bg-orange-soft">
                  <Briefcase size={22} />
                </div>
              </div>
              <div className="stat-body">
                <h3>{dashboardData.stats.layanan.total}</h3>
                <span className="stat-subtext">{dashboardData.stats.layanan.active} aktif/publish</span>
              </div>
            </div>
          </div>

          {/* Card 3: Pesan Kontak */}
          <div className="col-12 col-md-6 col-xl-3">
            <div className="stat-card-clean">
              <div className="stat-header">
                <span className="stat-label">Pesan Kontak</span>
                <div className="stat-icon-wrapper bg-cyan-soft">
                  <MessageSquare size={22} />
                </div>
              </div>
              <div className="stat-body">
                <h3>{dashboardData.stats.pesan.total}</h3>
                <span className="stat-subtext">{dashboardData.stats.pesan.unread} belum dibaca</span>
              </div>
            </div>
          </div>

          {/* Card 4: Testimoni */}
          <div className="col-12 col-md-6 col-xl-3">
            <div className="stat-card-clean">
              <div className="stat-header">
                <span className="stat-label">Testimoni</span>
                <div className="stat-icon-wrapper bg-yellow-soft">
                  <Star size={22} />
                </div>
              </div>
              <div className="stat-body">
                <h3>{dashboardData.stats.testimoni.total}</h3>
                <span className="stat-subtext">{dashboardData.stats.testimoni.published} dipublikasikan</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Chart Area (Aktivitas Terkini) --- */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="chart-card">
              <div className="section-title">
                <TrendingUp size={20} className="text-muted" />
                <span>Aktivitas Terkini</span>
              </div>
              <div className="chart-area-dashed">
                <TrendingUp size={48} className="mb-3 opacity-50" />
                <p className="mb-1 fw-medium text-dark">Grafik aktivitas akan ditampilkan di sini</p>
                <small>Data analitik akan terintegrasi dengan PostgreSQL backend</small>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Lists --- */}
        <div className="row g-4">
          
          {/* Kolom Kiri: Pesan Terbaru */}
          <div className="col-12 col-lg-6">
            <div className="list-container">
              <div className="section-title">
                <MessageCircle size={20} className="text-muted" />
                <span>Pesan Terbaru</span>
              </div>
              <div className="d-flex flex-column">
                {dashboardData.recentMessages.map((msg) => (
                  <div className="list-item" key={msg.id}>
                    <div className="mt-1">
                      <div className="bg-light rounded p-2">
                        <MessageSquare size={16} className="text-muted" />
                      </div>
                    </div>
                    <div className="list-content">
                      <div className="d-flex justify-content-between">
                        <div className="list-title">{msg.user}</div>
                        <small className="text-muted">{msg.time}</small>
                      </div>
                      <div className="list-subtitle">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pelatihan Terbaru */}
          <div className="col-12 col-lg-6">
            <div className="list-container">
              <div className="section-title">
                <Clock size={20} className="text-muted" />
                <span>Pelatihan Terbaru</span>
              </div>
              <div className="d-flex flex-column">
                {dashboardData.recentTrainings.map((item) => (
                  <div className="list-item align-items-center" key={item.id}>
                    <div className="mt-1 me-3">
                      <div className="bg-blue-soft rounded p-2">
                        <GraduationCap size={18} />
                      </div>
                    </div>
                    <div className="list-content">
                      <div className="list-title">{item.title}</div>
                      <div className="list-meta">
                        {item.category} • {item.duration}
                      </div>
                    </div>
                    <div>
                      <span className={`badge-custom ${item.status === 'Publish' ? 'badge-publish' : 'badge-draft'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
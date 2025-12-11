import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { 
  GraduationCap, 
  Briefcase, 
  MessageSquare, 
  Star, 
  TrendingUp 
} from "lucide-react";
import { getDashboardStats } from "../api/dashboardApi";
import "../styles/pages/Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    pelatihan: 0,
    layanan: 0,
    pesan: 0,
    testimoni: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Data Statistik untuk Card
  const statCards = [
    { 
      label: "Total Pelatihan", 
      value: stats.pelatihan, 
      icon: GraduationCap, 
      bgClass: "bg-blue-soft",
      subtext: "Data terdaftar"
    },
    { 
      label: "Total Layanan", 
      value: stats.layanan, 
      icon: Briefcase, 
      bgClass: "bg-orange-soft",
      subtext: "Bidang usaha aktif"
    },
    { 
      label: "Pesan Kontak", 
      value: stats.pesan, 
      icon: MessageSquare, 
      bgClass: "bg-cyan-soft",
      subtext: "Pesan masuk"
    },
    { 
      label: "Testimoni", 
      value: stats.testimoni, 
      icon: Star, 
      bgClass: "bg-yellow-soft",
      subtext: "Ulasan pengguna"
    },
  ];

  return (
    <DashboardLayout>
      <div className="container-fluid p-0 dashboard-container">
        
        <div className="dashboard-header mb-4">
          <h2>Dashboard</h2>
          <p>Ringkasan data statistik PT MPN</p>
        </div>

        {/* Statistik Cards */}
        <div className="row g-4 mb-4">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div className="col-12 col-md-6 col-xl-3" key={index}>
                <div className="stat-card-clean">
                  <div className="stat-header">
                    <span className="stat-label">{stat.label}</span>
                    <div className={`stat-icon-wrapper ${stat.bgClass}`}>
                      <IconComponent size={22} />
                    </div>
                  </div>
                  <div className="stat-body">
                    <h3>{stat.value}</h3>
                    <span className="stat-subtext">{stat.subtext}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Area Placeholder */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="chart-card">
              <div className="section-title">
                <TrendingUp size={20} className="text-muted" />
                <span>Analitik</span>
              </div>
              <div className="chart-area-dashed">
                <TrendingUp size={48} className="mb-3 opacity-50" />
                <p className="mb-1 fw-medium text-dark">Grafik statistik</p>
                <small>Data real-time dari server</small>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
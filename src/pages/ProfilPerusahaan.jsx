import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Save, RotateCcw, Plus, X } from "lucide-react";
import "../styles/pages/Profil.css";

const ProfilPerusahaan = () => {
  const [loading, setLoading] = useState(true);
  const [newMission, setNewMission] = useState("");
  
  // State Data Profil
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    visi: "",
    misi: [], // Array string
    alamat: "",
    telepon: "",
    email: "",
    website: ""
  });

  // Simulasi Fetch Data dari Database
  useEffect(() => {
    const fetchData = async () => {
      // Nanti ganti dengan: const res = await fetch('/api/profil');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        name: "PT MULTIARTHA PUNDIMAS NAWASENA",
        tagline: "Mengembangkan Kompetensi, Membangun Masa Depan",
        visi: "Menjadi mitra terpercaya dalam pengembangan sumber daya manusia dan transformasi organisasi di Indonesia.",
        misi: [
          "Menyediakan program pelatihan dan pengembangan berkualitas tinggi",
          "Membantu organisasi mencapai performa optimal melalui people development",
          "Menghadirkan solusi bisnis yang inovatif dan berkelanjutan",
          "Membangun ekosistem pembelajaran yang mendukung pertumbuhan berkelanjutan",
          "Menciptakan dampak positif bagi masyarakat melalui peningkatan kompetensi SDM"
        ],
        alamat: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
        telepon: "+62 21 5555 1234",
        email: "info@mpnawasena.co.id",
        website: "www.mpnawasena.co.id"
      };
      
      setFormData(mockData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handler Perubahan Input Text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler Tambah Misi
  const handleAddMission = () => {
    if (!newMission.trim()) return;
    setFormData(prev => ({
      ...prev,
      misi: [...prev.misi, newMission]
    }));
    setNewMission("");
  };

  // Handler Hapus Misi
  const handleDeleteMission = (indexToDelete) => {
    setFormData(prev => ({
      ...prev,
      misi: prev.misi.filter((_, index) => index !== indexToDelete)
    }));
  };

  // Handler Simpan (Kirim ke Backend)
  const handleSave = async () => {
    // Nanti ganti dengan: await fetch('/api/profil', { method: 'POST', body: ... })
    alert("Data berhasil disimpan ke database (Simulasi)");
    console.log("Payload to DB:", formData);
  };

  if (loading) return <DashboardLayout><div className="p-5 text-center">Loading profil...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="container-fluid p-0" style={{ maxWidth: '1000px' }}>
        
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Profil Perusahaan</h2>
          <p className="text-muted">Kelola informasi profil perusahaan yang akan tampil di website.</p>
        </div>

        {/* --- Bagian 1: Informasi Umum --- */}
        <div className="profil-section">
          <div className="profil-section-title">Informasi Umum</div>
          
          <div className="mb-3">
            <label className="form-label-custom">Nama Perusahaan</label>
            <input 
              type="text" 
              className="form-control-custom"
              name="name"
              value={formData.name} 
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Tagline</label>
            <input 
              type="text" 
              className="form-control-custom"
              name="tagline"
              value={formData.tagline} 
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Visi</label>
            <textarea 
              className="form-control-custom" 
              rows="3"
              name="visi"
              value={formData.visi}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* --- Bagian 2: Misi Perusahaan (List Dinamis) --- */}
        <div className="profil-section">
          <div className="profil-section-title">Misi Perusahaan</div>
          
          <div className="mission-list">
            {formData.misi.map((item, index) => (
              <div key={index} className="mission-item">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary rounded-circle p-2" style={{width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center'}}>{index + 1}</span>
                  <span className="mission-text">{item}</span>
                </div>
                <button 
                  className="btn-delete-mission"
                  onClick={() => handleDeleteMission(index)}
                  title="Hapus Misi"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="add-mission-wrapper">
            <input 
              type="text" 
              className="form-control-custom"
              placeholder="Masukkan misi baru..."
              value={newMission}
              onChange={(e) => setNewMission(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMission()}
            />
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleAddMission}>
              <Plus size={18} /> Tambah
            </button>
          </div>
        </div>

        {/* --- Bagian 3: Informasi Kontak --- */}
        <div className="profil-section">
          <div className="profil-section-title">Informasi Kontak</div>

          <div className="mb-3">
            <label className="form-label-custom">Alamat Lengkap</label>
            <textarea 
              className="form-control-custom" 
              rows="2"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label-custom">Nomor Telepon</label>
              <input 
                type="text" 
                className="form-control-custom"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label-custom">Email</label>
              <input 
                type="email" 
                className="form-control-custom"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Website</label>
            <input 
              type="text" 
              className="form-control-custom"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* --- Tombol Aksi --- */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <RotateCcw size={18} /> Reset
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2 px-4" onClick={handleSave}>
            <Save size={18} /> Simpan Perubahan
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ProfilPerusahaan;
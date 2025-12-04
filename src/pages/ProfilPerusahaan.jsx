import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Save, RotateCcw, Plus, X, Trash2 } from "lucide-react";
import "../styles/pages/Profil.css";

const ProfilPerusahaan = () => {
  const [loading, setLoading] = useState(true);
  
  // State Input Sementara untuk Array
  const [newMisi, setNewMisi] = useState("");
  const [newLegalitas, setNewLegalitas] = useState("");
  const [newKeunggulan, setNewKeunggulan] = useState("");

  // State Utama (Sesuai Struktur Backend PostgreSQL)
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    tagline: "",
    visi: "",
    misi: [], // Array text
    about: "",
    legalitas: [], // Array text
    struktur_organisasi: {
      direktur_utama: "",
      direktur_operasional: "",
      direktur_keuangan: "",
      manager_admin_umum: "",
      manager_marketing: ""
    },
    keunggulan: [], // Array text
    kontak: {
      phone: "",
      email: "",
      address: "",
      mapsEmbed: ""
    },
    sosial_media: {
      linkedin: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      youtube: ""
    }
  });

  // 1. Fetch Data (Simulasi dari Backend)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Data Dummy Sesuai Request Anda
        const mockBackendData = {
          name : "PT MULTIARTHA PUNDIMAS NAWASENA",
          short_name : "MPN",
          tagline : "Pelatihan & Pengembangan SDM Profesional, Inovatif, dan Terpercaya",
          visi : "Menjadi perusahaan pelatihan dan pengembangan SDM profesional, inovatif, dan terpercaya di Indonesia.",
          misi : [
              "Menyelenggarakan program pelatihan berkualitas tinggi yang relevan dengan kebutuhan industri",
              "Mengembangkan kompetensi SDM melalui metode pembelajaran inovatif dan efektif",
              "Memberikan layanan konsultansi manajemen yang profesional dan solusi-oriented",
              "Membangun kemitraan strategis dengan berbagai institusi dan perusahaan",
              "Berkontribusi aktif dalam meningkatkan daya saing SDM Indonesia"
          ],
          about : "PT Multiartha Pundimas Nawasena (MPN) adalah perusahaan yang bergerak di bidang pelatihan dan pengembangan sumber daya manusia. Kami berkomitmen untuk memberikan program pelatihan berkualitas tinggi yang dirancang khusus untuk meningkatkan kompetensi dan produktivitas SDM di berbagai sektor industri.",
          legalitas : [
              "Pengesahan Badan Hukum: AHU-0001331.AH.01.01.Tahun 2025",
              "Akta Pendirian: Akta No07 (Januari 2025)",
              "Notaris: SELLY, S.H., M.Kn",
              "SPPL, Sertifikat Standar KBLI 68111, Tata Ruang UMK/UK, K3L, dan dokumen OSS lainnya"
          ],
          struktur_organisasi : {
              direktur_utama : "Doddy Dewayadi, SE, MM",
              direktur_operasional : "Tri Mulyo, SE",
              direktur_keuangan : "Rahmi Anggraini, ST",
              manager_admin_umum : "Marsha Annisaputri, S.Par.",
              manager_marketing : "Muhammad Adimas Calvin, SE"
          },
          keunggulan : [
              "Instruktur bersertifikat dan berpengalaman di bidangnya",
              "Materi pelatihan yang selalu up-to-date sesuai kebutuhan industri",
              "Metode pembelajaran interaktif dan aplikatif",
              "Fasilitas pelatihan yang lengkap dan modern"
          ],
          kontak : {
              phone : "0821-1472-6830",
              email : "ptmultiarthapundimasnawasena@gmail.com",
              address : "Ruko Sentra Eropa Blok B16, Ciangsana, Gunung Putri, Bogor 16968",
              mapsEmbed : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.2!2d106.9!3d-6.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjQnMDAuMCJTIDEwNsKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
          },
          sosial_media : {
              linkedin : "#",
              facebook : "#",
              instagram : "#",
              tiktok : "#",
              youtube : "#"
          }
        };

        setFormData(mockBackendData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profil:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handlers ---

  // 1. Handle Input Biasa (String)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Handle Nested Object (Kontak, Sosmed, Struktur)
  const handleNestedChange = (parentKey, childKey, value) => {
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  };

  // 3. Handle Array Add (Generic)
  const handleAddItem = (key, stateValue, setStateValue) => {
    if (!stateValue.trim()) return;
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key], stateValue]
    }));
    setStateValue("");
  };

  // 4. Handle Array Delete (Generic)
  const handleDeleteItem = (key, indexToDelete) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_, index) => index !== indexToDelete)
    }));
  };

  // 5. Handle Simpan
  const handleSave = async () => {
    // console.log("Payload siap kirim ke Backend:", formData);
    alert("Data berhasil disimpan (Simulasi)");
  };

  if (loading) return <DashboardLayout><div className="p-5 text-center">Loading profil...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="container-fluid p-0" style={{ maxWidth: '1000px' }}>
        
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Profil Perusahaan</h2>
          <p className="text-muted">Kelola data utama perusahaan yang akan ditampilkan di website.</p>
        </div>

        {/* --- SECTION 1: IDENTITAS & TENTANG --- */}
        <div className="profil-section">
          <div className="profil-section-title">Identitas & Tentang Perusahaan</div>
          
          <div className="row">
            <div className="col-md-8 mb-3">
              <label className="form-label-custom">Nama Resmi Perusahaan</label>
              <input 
                type="text" className="form-control-custom"
                name="name" value={formData.name} onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label-custom">Nama Singkat / Brand</label>
              <input 
                type="text" className="form-control-custom"
                name="short_name" value={formData.short_name} onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Tagline</label>
            <input 
              type="text" className="form-control-custom"
              name="tagline" value={formData.tagline} onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Tentang Perusahaan (About Us)</label>
            <textarea 
              className="form-control-custom" rows="4"
              name="about" value={formData.about} onChange={handleChange}
            />
          </div>
        </div>

        {/* --- SECTION 2: VISI & MISI --- */}
        <div className="profil-section">
          <div className="profil-section-title">Visi & Misi</div>
          
          <div className="mb-4">
            <label className="form-label-custom">Visi</label>
            <textarea 
              className="form-control-custom" rows="2"
              name="visi" value={formData.visi} onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label-custom mb-2">Misi</label>
            <div className="mission-list mb-3">
              {formData.misi.map((item, index) => (
                <div key={index} className="mission-item">
                  <div className="d-flex align-items-start gap-2">
                    <span className="badge bg-primary rounded-circle p-2 mt-1" style={{width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', fontSize: '0.75rem'}}>{index + 1}</span>
                    <span className="mission-text">{item}</span>
                  </div>
                  <button className="btn-delete-mission" onClick={() => handleDeleteItem('misi', index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="add-mission-wrapper">
              <input 
                type="text" className="form-control-custom"
                placeholder="Tambah poin misi baru..."
                value={newMisi}
                onChange={(e) => setNewMisi(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem('misi', newMisi, setNewMisi)}
              />
              <button className="btn btn-primary d-flex align-items-center gap-2" 
                onClick={() => handleAddItem('misi', newMisi, setNewMisi)}>
                <Plus size={18} /> Tambah
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: LEGALITAS & KEUNGGULAN --- */}
        <div className="row">
          {/* Kolom Kiri: Legalitas */}
          <div className="col-12 col-xl-6">
            <div className="profil-section h-100">
              <div className="profil-section-title">Legalitas Perusahaan</div>
              <div className="mission-list mb-3">
                {formData.legalitas.map((item, index) => (
                  <div key={index} className="mission-item">
                    <span className="mission-text" style={{fontSize:'0.9rem'}}>{item}</span>
                    <button className="btn-delete-mission" onClick={() => handleDeleteItem('legalitas', index)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-mission-wrapper">
                <input 
                  type="text" className="form-control-custom"
                  placeholder="Tambah legalitas..."
                  value={newLegalitas}
                  onChange={(e) => setNewLegalitas(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem('legalitas', newLegalitas, setNewLegalitas)}
                />
                <button className="btn btn-outline-primary" onClick={() => handleAddItem('legalitas', newLegalitas, setNewLegalitas)}>
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Keunggulan */}
          <div className="col-12 col-xl-6">
            <div className="profil-section h-100">
              <div className="profil-section-title">Keunggulan Kami</div>
              <div className="mission-list mb-3">
                {formData.keunggulan.map((item, index) => (
                  <div key={index} className="mission-item">
                    <span className="mission-text" style={{fontSize:'0.9rem'}}>{item}</span>
                    <button className="btn-delete-mission" onClick={() => handleDeleteItem('keunggulan', index)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-mission-wrapper">
                <input 
                  type="text" className="form-control-custom"
                  placeholder="Tambah keunggulan..."
                  value={newKeunggulan}
                  onChange={(e) => setNewKeunggulan(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem('keunggulan', newKeunggulan, setNewKeunggulan)}
                />
                <button className="btn btn-outline-primary" onClick={() => handleAddItem('keunggulan', newKeunggulan, setNewKeunggulan)}>
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: STRUKTUR ORGANISASI --- */}
        <div className="profil-section mt-4">
          <div className="profil-section-title">Struktur Organisasi</div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-custom">Direktur Utama</label>
              <input 
                type="text" className="form-control-custom"
                value={formData.struktur_organisasi.direktur_utama}
                onChange={(e) => handleNestedChange('struktur_organisasi', 'direktur_utama', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">Direktur Operasional</label>
              <input 
                type="text" className="form-control-custom"
                value={formData.struktur_organisasi.direktur_operasional}
                onChange={(e) => handleNestedChange('struktur_organisasi', 'direktur_operasional', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Direktur Keuangan</label>
              <input 
                type="text" className="form-control-custom"
                value={formData.struktur_organisasi.direktur_keuangan}
                onChange={(e) => handleNestedChange('struktur_organisasi', 'direktur_keuangan', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Manager Admin & Umum</label>
              <input 
                type="text" className="form-control-custom"
                value={formData.struktur_organisasi.manager_admin_umum}
                onChange={(e) => handleNestedChange('struktur_organisasi', 'manager_admin_umum', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Manager Marketing</label>
              <input 
                type="text" className="form-control-custom"
                value={formData.struktur_organisasi.manager_marketing}
                onChange={(e) => handleNestedChange('struktur_organisasi', 'manager_marketing', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 5: KONTAK & SOSIAL MEDIA --- */}
        <div className="profil-section">
          <div className="profil-section-title">Kontak & Sosial Media</div>
          
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label-custom">Email</label>
              <input 
                type="email" className="form-control-custom"
                value={formData.kontak.email}
                onChange={(e) => handleNestedChange('kontak', 'email', e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label-custom">Nomor Telepon / WhatsApp</label>
              <input 
                type="text" className="form-control-custom"
                value={formData.kontak.phone}
                onChange={(e) => handleNestedChange('kontak', 'phone', e.target.value)}
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label-custom">Alamat Lengkap</label>
              <textarea 
                className="form-control-custom" rows="2"
                value={formData.kontak.address}
                onChange={(e) => handleNestedChange('kontak', 'address', e.target.value)}
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label-custom">Link Google Maps (Embed)</label>
              <input 
                type="text" className="form-control-custom"
                placeholder="http://..."
                value={formData.kontak.mapsEmbed}
                onChange={(e) => handleNestedChange('kontak', 'mapsEmbed', e.target.value)}
              />
            </div>
          </div>
          
          <div className="border-top pt-3">
            <label className="form-label-custom mb-3">Tautan Sosial Media</label>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">LinkedIn</span>
                  <input type="text" className="form-control form-control-custom rounded-end"
                    value={formData.sosial_media.linkedin}
                    onChange={(e) => handleNestedChange('sosial_media', 'linkedin', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">Instagram</span>
                  <input type="text" className="form-control form-control-custom rounded-end" 
                    value={formData.sosial_media.instagram}
                    onChange={(e) => handleNestedChange('sosial_media', 'instagram', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">TikTok</span>
                  <input type="text" className="form-control form-control-custom rounded-end" 
                    value={formData.sosial_media.tiktok}
                    onChange={(e) => handleNestedChange('sosial_media', 'tiktok', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">YouTube</span>
                  <input type="text" className="form-control form-control-custom rounded-end" 
                    value={formData.sosial_media.youtube}
                    onChange={(e) => handleNestedChange('sosial_media', 'youtube', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TOMBOL AKSI --- */}
        <div className="profil-actions pb-5">
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
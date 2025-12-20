import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Save, RotateCcw, Plus, X, Trash2 } from "lucide-react";
import { getProfil, updateProfil } from "../api/profilApi"; // Import API
import { ToastContainer, toast } from "react-toastify";
import "../styles/pages/Profil.css";

const ProfilPerusahaan = () => {
  const [loading, setLoading] = useState(true);
  const [profileSource, setProfileSource] = useState("");

  // State Input Sementara untuk Array
  const [newMisi, setNewMisi] = useState("");
  const [newLegalitas, setNewLegalitas] = useState("");
  const [newKeunggulan, setNewKeunggulan] = useState("");

  // State Utama
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    tagline: "",
    visi: "",
    misi: [],
    about: "",
    legalitas: [],
    struktur_organisasi: {
      direktur_utama: "",
      direktur_operasional: "",
      direktur_keuangan: "",
      manager_admin_umum: "",
      manager_marketing: "",
    },
    keunggulan: [],
    kontak: {
      phone: "",
      email: "",
      address: "",
      mapsEmbed: "",
    },
    sosial_media: {
      // linkedin: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      youtube: "",
    },
  });

  // 1. Fetch Data dari Backend
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getProfil();
      if (result?.data) {
        setFormData(result.data);
        setProfileSource(result.source || "");
      }
    } catch (error) {
      console.error("Gagal memuat profil:", error);
      toast.error("Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parentKey, childKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  const handleAddItem = (key, stateValue, setStateValue) => {
    if (!stateValue.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), stateValue],
    }));
    setStateValue("");
  };

  const handleDeleteItem = (key, indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, index) => index !== indexToDelete),
    }));
  };

  // 2. Simpan ke Backend
  const handleSave = async () => {
    try {
      await updateProfil(formData);
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      toast.error("Gagal menyimpan perubahan.");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="container-fluid p-0" style={{ maxWidth: "1000px" }}>
        <ToastContainer position="top-right" />

        <div className="mb-4">
          <h2 className="fw-bold text-dark">Profil Perusahaan</h2>
          <p className="text-muted">
            Kelola data utama perusahaan yang akan ditampilkan di website.
          </p>
          {profileSource && !["api", "cache"].includes(profileSource) && (
            <div className="alert alert-warning mt-3">
              Perubahan company profile tidak akan otomatis tampil di website
              public sampai public mengambil sumber terbaru (saat ini memakai{" "}
              {profileSource === "fallback-json" ? "profil.json" : "data lokal"}
              ).
            </div>
          )}
        </div>

        {/* --- SECTION 1: IDENTITAS & TENTANG --- */}
        <div className="profil-section">
          <div className="profil-section-title">
            Identitas & Tentang Perusahaan
          </div>
          <div className="row">
            <div className="col-md-8 mb-3">
              <label className="form-label-custom">Nama Resmi Perusahaan</label>
              <input
                type="text"
                className="form-control-custom"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label-custom">Nama Singkat / Brand</label>
              <input
                type="text"
                className="form-control-custom"
                name="short_name"
                value={formData.short_name || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label-custom">Tagline</label>
            <input
              type="text"
              className="form-control-custom"
              name="tagline"
              value={formData.tagline || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label-custom">Tentang Perusahaan</label>
            <textarea
              className="form-control-custom"
              rows="4"
              name="about"
              value={formData.about || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* --- SECTION 2: VISI & MISI --- */}
        <div className="profil-section">
          <div className="profil-section-title">Visi & Misi</div>
          <div className="mb-4">
            <label className="form-label-custom">Visi</label>
            <textarea
              className="form-control-custom"
              rows="2"
              name="visi"
              value={formData.visi || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label-custom mb-2">Misi</label>
            <div className="mission-list mb-3">
              {(formData.misi || []).map((item, index) => (
                <div key={index} className="mission-item">
                  <div className="d-flex align-items-start gap-2">
                    <span
                      className="badge bg-primary rounded-circle p-2 mt-1"
                      style={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                      }}
                    >
                      {index + 1}
                    </span>
                    <span className="mission-text">{item}</span>
                  </div>
                  <button
                    className="btn-delete-mission"
                    onClick={() => handleDeleteItem("misi", index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="add-mission-wrapper">
              <input
                type="text"
                className="form-control-custom"
                placeholder="Tambah poin misi baru..."
                value={newMisi}
                onChange={(e) => setNewMisi(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleAddItem("misi", newMisi, setNewMisi)
                }
              />
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => handleAddItem("misi", newMisi, setNewMisi)}
              >
                <Plus size={18} /> Tambah
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: LEGALITAS & KEUNGGULAN --- */}
        <div className="row">
          <div className="col-12 col-xl-6">
            <div className="profil-section h-100">
              <div className="profil-section-title">Legalitas Perusahaan</div>
              <div className="mission-list mb-3">
                {(formData.legalitas || []).map((item, index) => (
                  <div key={index} className="mission-item">
                    <span
                      className="mission-text"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {item}
                    </span>
                    <button
                      className="btn-delete-mission"
                      onClick={() => handleDeleteItem("legalitas", index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-mission-wrapper">
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Tambah legalitas..."
                  value={newLegalitas}
                  onChange={(e) => setNewLegalitas(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleAddItem("legalitas", newLegalitas, setNewLegalitas)
                  }
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    handleAddItem("legalitas", newLegalitas, setNewLegalitas)
                  }
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-6">
            <div className="profil-section h-100">
              <div className="profil-section-title">Keunggulan Kami</div>
              <div className="mission-list mb-3">
                {(formData.keunggulan || []).map((item, index) => (
                  <div key={index} className="mission-item">
                    <span
                      className="mission-text"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {item}
                    </span>
                    <button
                      className="btn-delete-mission"
                      onClick={() => handleDeleteItem("keunggulan", index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-mission-wrapper">
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Tambah keunggulan..."
                  value={newKeunggulan}
                  onChange={(e) => setNewKeunggulan(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleAddItem("keunggulan", newKeunggulan, setNewKeunggulan)
                  }
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    handleAddItem("keunggulan", newKeunggulan, setNewKeunggulan)
                  }
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: KONTAK & SOSIAL MEDIA --- */}
        <div className="profil-section mt-4">
          <div className="profil-section-title">Kontak & Sosial Media</div>
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label-custom">Email</label>
              <input
                type="email"
                className="form-control-custom"
                value={formData.kontak?.email || ""}
                onChange={(e) =>
                  handleNestedChange("kontak", "email", e.target.value)
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label-custom">Nomor Telepon</label>
              <input
                type="text"
                className="form-control-custom"
                value={formData.kontak?.phone || ""}
                onChange={(e) =>
                  handleNestedChange("kontak", "phone", e.target.value)
                }
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label-custom">Alamat Lengkap</label>
              <textarea
                className="form-control-custom"
                rows="2"
                value={formData.kontak?.address || ""}
                onChange={(e) =>
                  handleNestedChange("kontak", "address", e.target.value)
                }
              />
            </div>
          </div>
          <div className="border-top pt-3">
            <label className="form-label-custom mb-3">
              Tautan Sosial Media
            </label>
            <div className="row g-3">
              {/* <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">LinkedIn</span>
                  <input
                    type="text"
                    className="form-control form-control-custom rounded-end"
                    value={formData.sosial_media?.linkedin || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "sosial_media",
                        "linkedin",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div> */}
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">Facebook</span>
                  <input
                    type="text"
                    className="form-control form-control-custom rounded-end"
                    value={formData.sosial_media?.facebook || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "sosial_media",
                        "facebook",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">Instagram</span>
                  <input
                    type="text"
                    className="form-control form-control-custom rounded-end"
                    value={formData.sosial_media?.instagram || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "sosial_media",
                        "instagram",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">Tiktok</span>
                  <input
                    type="text"
                    className="form-control form-control-custom rounded-end"
                    value={formData.sosial_media?.tiktok || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "sosial_media",
                        "tiktok",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">Youtube</span>
                  <input
                    type="text"
                    className="form-control form-control-custom rounded-end"
                    value={formData.sosial_media?.youtube || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "sosial_media",
                        "youtube",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TOMBOL AKSI --- */}
        <div className="profil-actions pb-5">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={loadData}
          >
            <RotateCcw size={18} /> Reset
          </button>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 px-4"
            onClick={handleSave}
          >
            <Save size={18} /> Simpan Perubahan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilPerusahaan;

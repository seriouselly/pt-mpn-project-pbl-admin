// src/api/profilApi.js

// MOCK DATA: Digunakan karena backend belum memiliki endpoint '/api/company-profile'
const MOCK_PROFIL = {
  name: "PT MULTIARTHA PUNDIMAS NAWASENA",
  short_name: "MPN",
  tagline: "Pelatihan & Pengembangan SDM Profesional",
  visi: "Menjadi mitra terpercaya dalam pengembangan SDM.",
  misi: ["Memberikan pelatihan berkualitas", "Meningkatkan kompetensi SDM"],
  about: "Kami adalah perusahaan training consultant yang berfokus pada pengembangan kualitas sumber daya manusia...",
  legalitas: ["SK Kemenkumham", "NIB", "SPPL"],
  keunggulan: ["Trainer Tersertifikasi", "Modul Up-to-date", "Layanan Prima"],
  struktur_organisasi: {
    direktur_utama: "Bapak Direktur",
    direktur_operasional: "Bapak Ops",
    direktur_keuangan: "Ibu Keuangan",
    manager_admin_umum: "Ibu Admin",
    manager_marketing: "Bapak Marketing"
  },
  kontak: {
    phone: "08123456789",
    email: "info@mpn.co.id",
    address: "Ruko Sentra Eropa, Bogor",
    mapsEmbed: ""
  },
  sosial_media: {
    linkedin: "", facebook: "", instagram: "", tiktok: "", youtube: ""
  }
};

export async function getProfil() {
  // Simulasi ambil data (delay 500ms)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROFIL);
    }, 500);
  });
}

export async function updateProfil(data) {
  // PERBAIKAN DI SINI:
  // Menggunakan variabel 'data' agar ESLint tidak error "defined but never used"
  console.log("Menyimpan data profil ke database (Simulasi):", data);

  // Simulasi sukses update
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "Berhasil update (Simulasi Frontend Only)" });
    }, 500);
  });
}
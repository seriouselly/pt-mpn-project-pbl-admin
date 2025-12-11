// src/api/profilApi.js
// Membaca profil dari JSON (sesuai arahan backend pakai JSON). Fallback ke mock/localStorage jika perlu.

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

const JSON_URL = import.meta.env.VITE_PROFIL_JSON_URL || "/profil.json";
const SAVE_URL = import.meta.env.VITE_PROFIL_SAVE_URL; // optional endpoint jika backend ada
const STORAGE_KEY = "mpn_profil_cache";

export async function getProfil() {
  // Prioritas: cache localStorage (jika ada simpanan terbaru)
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Jika tersedia endpoint simpan, coba GET dari sana lebih dulu
  if (SAVE_URL) {
    try {
      const res = await fetch(SAVE_URL, { credentials: "include" });
      if (!res.ok) throw new Error("Failed fetch profil (SAVE_URL)");
      const data = await res.json();
      return data || MOCK_PROFIL;
    } catch (e) {
      console.warn("Gagal mengambil profil dari SAVE_URL, fallback JSON:", e);
    }
  }

  // Ambil JSON statis
  try {
    const res = await fetch(JSON_URL, { credentials: "include" });
    if (!res.ok) throw new Error("Failed fetch profil.json");
    const data = await res.json();
    return data || MOCK_PROFIL;
  } catch (e) {
    console.warn("Gagal mengambil profil JSON, fallback ke mock:", e);
    return MOCK_PROFIL;
  }
}

export async function updateProfil(data) {
  // Jika ada endpoint simpan, kirim ke sana
  if (SAVE_URL) {
    const resp = await fetch(SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Gagal menyimpan profil");
    }
    const result = await resp.json().catch(() => ({}));
    // Simpan cache lokal supaya halaman menampilkan data terbaru tanpa reload JSON statis
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return result || { message: "Profil diperbarui" };
  }

  // Tanpa endpoint: simpan di localStorage saja sebagai cache (sesuai permintaan JSON-only)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { message: "Profil disimpan lokal (cache). Pastikan backend JSON diperbarui manual." };
}

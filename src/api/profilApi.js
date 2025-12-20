import axiosClient from "./axiosClient";

const API_GET_PATH = "/api/company-profile";
const API_UPDATE_PATH = "/api/company-profile/update";
const JSON_URL = import.meta.env.VITE_PROFIL_JSON_URL || "/profil.json";
const STORAGE_KEY = "mpn_profil_cache";

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
    manager_marketing: "Bapak Marketing",
  },
  kontak: {
    phone: "08123456789",
    email: "info@mpn.co.id",
    address: "Ruko Sentra Eropa, Bogor",
    mapsEmbed: "",
  },
  sosial_media: {
    linkedin: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  },
};

async function fetchJsonFallback() {
  const res = await fetch(JSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed fetch profil JSON");
  return res.json();
}

export async function getProfil() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return { data: JSON.parse(cached), source: "cache" };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  try {
    const res = await axiosClient.get(API_GET_PATH);
    const data = res.data?.data || res.data;
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { data, source: "api" };
    }
  } catch (e) {
    console.warn("Gagal mengambil profil dari API, fallback JSON:", e);
  }

  try {
    const data = await fetchJsonFallback();
    return { data: data || MOCK_PROFIL, source: "fallback-json" };
  } catch (e) {
    console.warn("Gagal mengambil profil JSON, fallback ke mock:", e);
    return { data: MOCK_PROFIL, source: "mock" };
  }
}

export async function updateProfil(data) {
  try {
    const res = await axiosClient.put(API_UPDATE_PATH, data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return res.data;
  } catch (e) {
    const message = e.response?.data?.errors || e.response?.data?.message || e.message;
    throw new Error(message || "Gagal menyimpan profil");
  }
}

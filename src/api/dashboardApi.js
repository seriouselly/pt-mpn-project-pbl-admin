import axiosClient from "./axiosClient";

export async function getDashboardStats() {
  try {
    const [resPelatihan, resLayanan, resPesan, resTestimoni] = await Promise.all([
      axiosClient.get("/api/jenis-usaha"),
      axiosClient.get("/api/bidang-usaha"),
      axiosClient.get("/api/pesan"),
      axiosClient.get("/api/testimoni")
    ]);

    // Perhatikan perbedaan struktur response di sini!
    return {
      pelatihan: resPelatihan.data?.data?.length || 0, // { data: [] }
      layanan: resLayanan.data?.length || 0,           // []
      pesan: resPesan.data?.length || 0,               // []
      testimoni: resTestimoni.data?.data?.length || 0  // { data: [] }
    };
  } catch (error) {
    console.error("Gagal memuat statistik dashboard:", error);
    return { pelatihan: 0, layanan: 0, pesan: 0, testimoni: 0 };
  }
}
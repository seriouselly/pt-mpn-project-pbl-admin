import axiosClient from "./axiosClient";

export async function getLayanan() {
  const response = await axiosClient.get("/api/bidang-usaha");
  // Backend Bidang Usaha mengembalikan Array langsung: [...]
  return response.data;
}

export async function createLayanan(data) {
  const formData = new FormData();
  formData.append("nama_BUsaha", data.nama);
  formData.append("deskripsi", data.deskripsi);
  if (data.foto_file) formData.append("poto", data.foto_file);

  const response = await axiosClient.post("/api/bidang-usaha/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateLayanan(id, data) {
  try {
    // Step 1: Update text (nama + deskripsi) - JSON
    await axiosClient.put(`/api/bidang-usaha/${id}`, {
      nama_BUsaha: data.nama,
      deskripsi: data.deskripsi,
    });

    // Step 2: Update foto jika ada file baru
    if (data.foto_file) {
      const formData = new FormData();
      formData.append("poto", data.foto_file);

      try {
        await axiosClient.put(`/api/bidang-usaha/foto/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        try {
          await axiosClient.patch(`/api/bidang-usaha/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch {
          await axiosClient.post(`/api/bidang-usaha/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ Error in updateLayanan:",
      error.response?.data || error.message
    );

    // Extract error message
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      error.message;

    throw new Error(
      typeof errorMsg === "string" ? errorMsg : "Gagal update layanan"
    );
  }
}

export async function deleteLayanan(id) {
  const response = await axiosClient.delete(`/api/bidang-usaha/${id}`);
  return response.data;
}

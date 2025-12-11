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
  if (data.gambar_file) formData.append("poto", data.gambar_file);

  const response = await axiosClient.post("/api/bidang-usaha/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateLayanan(id, data) {
  // Update Teks
  await axiosClient.put(`/api/bidang-usaha/${id}`, {
    nama_BUsaha: data.nama,
    deskripsi: data.deskripsi
  });

  // Update Foto
  if (data.gambar_file) {
    const formData = new FormData();
    formData.append("poto", data.gambar_file);
    await axiosClient.put(`/api/bidang-usaha/foto/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return true;
}

export async function deleteLayanan(id) {
  const response = await axiosClient.delete(`/api/bidang-usaha/${id}`);
  return response.data;
}
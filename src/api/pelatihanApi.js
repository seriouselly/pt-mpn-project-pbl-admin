import axiosClient from "./axiosClient";

export async function getPelatihan() {
  const response = await axiosClient.get("/api/jenis-usaha");
  // Backend Jenis Usaha mengembalikan object: { data: [...] }
  return response.data.data || [];
}

export async function createPelatihan(data) {
  const formData = new FormData();
  formData.append("nama_jenis", data.nama);
  formData.append("deskripsi", data.deskripsi);
  formData.append("status", data.status || "active");
  if (data.layanan_id) formData.append("bidangUsahaId", data.layanan_id);
  if (data.gambar_file) formData.append("foto", data.gambar_file);

  if (!data.layanan_id) throw new Error("Pilih layanan induk terlebih dahulu!");

  const response = await axiosClient.post(
    `/api/jenis-usaha/add/${data.layanan_id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}

export async function updatePelatihan(id, data) {
  const formData = new FormData();
  formData.append("nama_jenis", data.nama);
  formData.append("deskripsi", data.deskripsi);
  formData.append("status", data.status || "active");
  if (data.layanan_id) formData.append("bidangUsahaId", data.layanan_id);
  if (data.gambar_file) formData.append("foto", data.gambar_file);

  const response = await axiosClient.put(
    `/api/jenis-usaha/update/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}

export async function deletePelatihan(id) {
  const response = await axiosClient.delete(`/api/jenis-usaha/delete/${id}`);
  return response.data;
}

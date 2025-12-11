import axiosClient from "./axiosClient";

export async function getTestimoni() {
  const response = await axiosClient.get("/api/testimoni");
  // Backend Testimoni mengembalikan object: { data: [...] }
  return response.data.data || []; 
}

export async function createTestimoni(data) {
  const formData = new FormData();
  formData.append("nama", data.nama);
  formData.append("pesan_testi", data.testimoni); 
  if (data.foto_file) formData.append("foto", data.foto_file);

  const response = await axiosClient.post("/api/testimoni/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateTestimoni(id, data) {
  const formData = new FormData();
  formData.append("nama", data.nama);
  formData.append("pesan_testi", data.testimoni);
  if (data.foto_file) formData.append("foto", data.foto_file);

  const response = await axiosClient.put(`/api/testimoni/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteTestimoni(id) {
  const response = await axiosClient.delete(`/api/testimoni/${id}`);
  return response.data;
}
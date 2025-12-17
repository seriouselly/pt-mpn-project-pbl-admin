import axiosClient from "./axiosClient";

const PARTNER_BASE = "/api/partners";

const normalizeList = (res) => {
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};

export async function getPartners() {
  const response = await axiosClient.get(PARTNER_BASE);
  return normalizeList(response);
}

export async function createPartner(data) {
  const formData = new FormData();
  formData.append("nama_partner", data.nama || data.nama_partner);
  formData.append("deskripsi", data.deskripsi || "");
  const file = data.logo_file || data.foto_file;
  if (file) formData.append("logo", file);

  const response = await axiosClient.post(`${PARTNER_BASE}/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updatePartner(id, data) {
  const formData = new FormData();
  formData.append("nama_partner", data.nama || data.nama_partner);
  formData.append("deskripsi", data.deskripsi || "");
  const file = data.logo_file || data.foto_file;
  if (file) formData.append("logo", file);

  const response = await axiosClient.put(`${PARTNER_BASE}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deletePartner(id) {
  const response = await axiosClient.delete(`${PARTNER_BASE}/${id}`);
  return response.data;
}

import axiosClient from "./axiosClient";

const GALLERY_BASE = "/api/gallery";

const normalizeList = (res) => {
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};

export async function getGallery() {
  const res = await axiosClient.get(GALLERY_BASE);
  return normalizeList(res);
}

export async function createGallery(data) {
  const formData = new FormData();
  if (data.id_users) formData.append("id_users", data.id_users);
  if (data.foto_file || data.image_file) {
    formData.append("image", data.foto_file || data.image_file);
  }

  const res = await axiosClient.post(`${GALLERY_BASE}/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateGallery(id, data) {
  const formData = new FormData();
  if (data.id_users) formData.append("id_users", data.id_users);
  if (data.foto_file || data.image_file) {
    formData.append("image", data.foto_file || data.image_file);
  }

  const res = await axiosClient.put(`${GALLERY_BASE}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteGallery(id) {
  const res = await axiosClient.delete(`${GALLERY_BASE}/${id}`);
  return res.data;
}

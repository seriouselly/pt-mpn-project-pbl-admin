import axiosClient from "./axiosClient";

const BASE = "/api/pesan";

const normalizeList = (res) => {
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};

export async function getPesan() {
  const res = await axiosClient.get(BASE);
  return normalizeList(res);
}

export async function getPesanById(id) {
  const res = await axiosClient.get(`${BASE}/${id}`);
  return res.data;
}

export async function updatePesan(id, status) {
  const res = await axiosClient.put(`${BASE}/${id}`, { status });
  return res.data;
}

export async function deletePesan(id) {
  const res = await axiosClient.delete(`${BASE}/${id}`);
  return res.data;
}


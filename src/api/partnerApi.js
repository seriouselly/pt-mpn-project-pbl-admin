import axiosClient from "./axiosClient";

const PARTNER_BASE = import.meta.env.VITE_PARTNER_BASE_PATH || "/api/partners";

const normalizeList = (res) => {
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};

// Helper fallback untuk kompatibilitas variasi endpoint
async function tryPaths(method, paths, payload) {
  let lastError;
  for (const path of paths) {
    try {
      const res = await axiosClient.request({ method, url: path, data: payload });
      return res;
    } catch (e) {
      lastError = e;
      if (e.response?.status !== 404) throw e; // fallback hanya jika 404
    }
  }
  throw lastError;
}

export async function getPartners() {
  const response = await tryPaths("get", [PARTNER_BASE, PARTNER_BASE.replace(/s$/, "")]);
  return normalizeList(response);
}

export async function createPartner(data) {
  const formData = new FormData();
  formData.append("nama_partner", data.nama || data.nama_partner);
  formData.append("deskripsi", data.deskripsi || "");
  const file = data.logo_file || data.foto_file;
  if (file) formData.append("logo", file);

  const paths = [
    PARTNER_BASE,                         // /api/partners
    `${PARTNER_BASE}/`,                   // /api/partners/
    `${PARTNER_BASE}/add`,                // /api/partners/add
    PARTNER_BASE.replace(/s$/, ""),       // /api/partner
    `${PARTNER_BASE.replace(/s$/, "")}/add`, // /api/partner/add
  ];

  const response = await tryPaths("post", paths, formData);
  return response.data;
}

export async function updatePartner(id, data) {
  const formData = new FormData();
  formData.append("nama_partner", data.nama || data.nama_partner);
  formData.append("deskripsi", data.deskripsi || "");
  const file = data.logo_file || data.foto_file;
  if (file) formData.append("logo", file);

  const paths = [
    `${PARTNER_BASE}/${id}`,                    // /api/partners/:id
    `${PARTNER_BASE}/${id}/`,                   // /api/partners/:id/
    `${PARTNER_BASE}/update/${id}`,             // /api/partners/update/:id
    `${PARTNER_BASE.replace(/s$/, "")}/${id}`,  // /api/partner/:id
    `${PARTNER_BASE.replace(/s$/, "")}/${id}/`, // /api/partner/:id/
    `${PARTNER_BASE.replace(/s$/, "")}/update/${id}`, // /api/partner/update/:id
  ];

  const response = await tryPaths("put", paths, formData);
  return response.data;
}

export async function deletePartner(id) {
  const paths = [
    `${PARTNER_BASE}/${id}`,                    // /api/partners/:id
    `${PARTNER_BASE}/${id}/`,                   // /api/partners/:id/
    `${PARTNER_BASE}/delete/${id}`,             // /api/partners/delete/:id
    `${PARTNER_BASE.replace(/s$/, "")}/${id}`,  // /api/partner/:id
    `${PARTNER_BASE.replace(/s$/, "")}/${id}/`, // /api/partner/:id/
    `${PARTNER_BASE.replace(/s$/, "")}/delete/${id}`, // /api/partner/delete/:id
  ];

  const response = await tryPaths("delete", paths);
  return response.data;
}

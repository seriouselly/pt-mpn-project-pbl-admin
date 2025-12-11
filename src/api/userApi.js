import axiosClient from "./axiosClient";

const USER_BASE = import.meta.env.VITE_USER_BASE_PATH || "/api/users";
const USER_CREATE_PATH = import.meta.env.VITE_USER_CREATE_PATH || `${USER_BASE}/add`; // default /api/users/add
const USER_UPDATE_PATH = import.meta.env.VITE_USER_UPDATE_PATH || `/api/usersupdate`; // default /api/usersupdate (tanpa slash)
const USER_DELETE_PATH = import.meta.env.VITE_USER_DELETE_PATH || `${USER_BASE}/delete/`; // default /api/users/delete/:id
const USER_UPDATE_ID_FIELD = import.meta.env.VITE_USER_ID_FIELD || ""; // default: tidak kirim id di body, set via env jika perlu

// Helper untuk mencoba beberapa endpoint jika 404 (agar kompatibel dengan variasi backend)
async function tryPaths(method, pathsWithId = [], payload) {
  let lastError;
  for (const path of pathsWithId) {
    try {
      const res = await axiosClient.request({ method, url: path, data: payload });
      return res;
    } catch (e) {
      lastError = e;
      if (e.response?.status !== 404) throw e; // hanya fallback bila 404
    }
  }
  throw lastError;
}

export async function getUsers() {
  // Coba /api/users lalu fallback /api/user
  const response = await tryPaths("get", [USER_BASE, USER_BASE.replace(/s$/, "")]);
  // Backend Users mengembalikan object: { data: [...] }
  return response.data.data || response.data || [];
}

export async function createUser(data) {
  const payload = { name: data.name, email: data.email, password: data.password, telp: data.telp };
  const response = await axiosClient.post(USER_CREATE_PATH, payload);
  return response.data;
}

export async function updateUser(id, data) {
  // Password opsional saat edit; hanya kirim bila ada
  const payload = { name: data.name, email: data.email, telp: data.telp };
  if (data.password) payload.password = data.password;
  const body = { ...payload };
  if (USER_UPDATE_ID_FIELD) body[USER_UPDATE_ID_FIELD] = id;

  // Prioritas: endpoint tunggal tanpa slash id
  const paths = [
    USER_UPDATE_PATH,                // /api/usersupdate (default)
    `${USER_UPDATE_PATH}${id}`,      // /api/usersupdate<id> jika backend begitu
    `${USER_UPDATE_PATH}/${id}`,     // fallback dengan slash
  ];

  for (const p of paths) {
    try {
      const res = await axiosClient.put(p, body);
      return res.data;
    } catch (e) {
      if (e.response?.status === 404) continue;
      throw e;
    }
  }

  throw new Error("Update user endpoint tidak ditemukan (404)");
}

export async function deleteUser(id) {
  const response = await axiosClient.delete(`${USER_DELETE_PATH}${id}`);
  return response.data;
}

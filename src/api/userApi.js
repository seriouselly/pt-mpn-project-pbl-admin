import axiosClient from "./axiosClient";

const USER_BASE = "/api/users";
const USER_CREATE_PATH = `${USER_BASE}/add`;
const USER_UPDATE_PATH = `${USER_BASE}/update`;

export async function getUsers() {
  const response = await axiosClient.get(USER_BASE);
  return response.data?.data || response.data || [];
}

export async function createUser(data) {
  const payload = { name: data.name?.trim(), email: data.email?.trim(), password: data.password, telp: data.telp?.trim() };
  const response = await axiosClient.post(USER_CREATE_PATH, payload);
  return response.data;
}

export async function updateUser(id, data) {
  const payload = { name: data.name?.trim(), email: data.email?.trim(), telp: data.telp?.trim() };
  delete payload.id;
  if (data.password) {
    payload.password = data.password;
    if (data.currentPassword) payload.currentPassword = data.currentPassword;
  }

  const res = await axiosClient.put(USER_UPDATE_PATH, payload);
  return res.data;
}

// Attempt update specific user by id. If backend rejects id, fallback to self-update.
export async function updateUserById(id, data) {
  const payload = { name: data.name?.trim(), email: data.email?.trim(), telp: data.telp?.trim() };
  if (data.password) {
    payload.password = data.password;
    if (data.currentPassword) payload.currentPassword = data.currentPassword;
  }

  try {
    const res = await axiosClient.put(`${USER_BASE}/${id}`, payload);
    return res.data;
  } catch (err) {
    if (err.response?.data?.errors?.includes('"id" is not allowed') || err.response?.status === 404) {
      // Fallback to self-update path if API doesn't support update-by-id
      const res = await axiosClient.put(USER_UPDATE_PATH, payload);
      return res.data;
    }
    throw err;
  }
}

export async function deleteUser(id) {
  try {
    const res = await axiosClient.delete(`${USER_BASE}/${id}`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const res = await axiosClient.delete(`${USER_BASE}/delete/${id}`);
      return res.data;
    }
    throw err;
  }
}

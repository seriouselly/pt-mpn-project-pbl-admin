import axios from 'axios';

// Gunakan path relatif saat dev (localhost/127.0.0.1) agar lewat proxy Vite dan lolos CORS
const isLocalDev = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const axiosClient = axios.create({
  // Di produksi gunakan BASE_URL dari environment variable
  baseURL: isLocalDev ? "" : import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Wajib: Agar cookie token tersimpan
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Flag agar redirect/login cleanup hanya sekali per rangkaian error 401
let hasRedirected401 = false;

const handleUnauthorized = () => {
  if (hasRedirected401) return;
  hasRedirected401 = true;
  localStorage.removeItem("mpn_admin_token");
  localStorage.removeItem("mpn_admin_user");
  // Paksa ke halaman login tanpa reload penuh, mencegah loop
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

// Interceptor request: sisipkan Bearer token jika tersedia
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("mpn_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk menangani error
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      console.warn("Sesi habis (401). Membersihkan data lokal.");
      handleUnauthorized();
    }

    // Ambil pesan error dari backend jika ada
    if (response && response.data) {
      const serverMsg = response.data.errors || response.data.message;
      if (serverMsg) error.message = serverMsg;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

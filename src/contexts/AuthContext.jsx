import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek localStorage saat refresh halaman
    const storedUser = localStorage.getItem("mpn_admin_user");
    const storedToken = localStorage.getItem("mpn_admin_token");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch { 
        // PERBAIKAN 1: Hapus 'e' karena tidak digunakan
        localStorage.removeItem("mpn_admin_user");
      }
    }
    if (storedToken) {
      axiosClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Login attempt...", email);
      
      const response = await axiosClient.post("/api/users/login", {
        email,
        password,
      });

      console.log("Response Login:", response.data);

      const userData = response.data?.data?.user || response.data?.user;
      const token = response.data?.token || response.data?.data?.token || response.data?.accessToken || response.data?.data?.accessToken;

      if (!userData) {
        return { success: false, message: "Login gagal: Data user tidak ditemukan." };
      }

      const role = (userData.role || "").toUpperCase();
      if (role !== "SUPERADMIN" && role !== "ADMIN") {
        return { success: false, message: "Akses ditolak. Anda bukan Admin." };
      }

      setUser(userData);
      localStorage.setItem("mpn_admin_user", JSON.stringify(userData));
      if (token) {
        localStorage.setItem("mpn_admin_token", token);
        axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      
      return { success: true };

    } catch (error) {
      console.error("Login Error:", error);
      let msg = "Terjadi kesalahan koneksi.";
      
      if (error.response) {
        msg = error.response.data.errors || error.response.data.message || "Email atau password salah.";
      }
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/api/users/logout");
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      localStorage.removeItem("mpn_admin_user");
      localStorage.removeItem("mpn_admin_token");
      delete axiosClient.defaults.headers.common.Authorization;
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// PERBAIKAN 2: Tambahkan disable rule untuk export hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cek session di localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("mpn_admin_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login dummy
  const login = async (email, password) => {
    if (email === "admin@mpn.co.id" && password === "admin123") {
      const userData = {
        email: "admin@mpn.co.id",
        name: "Admin MPN",
        role: "Administrator",
      };

      setUser(userData);
      localStorage.setItem("mpn_admin_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("mpn_admin_user");
    navigate("/login");
  };

  // Update data user
  const updateProfile = (data) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem("mpn_admin_user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk memakai auth
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

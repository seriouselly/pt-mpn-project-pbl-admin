import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layanan from "./pages/Layanan";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Pelatihan from "./pages/Pelatihan";
import Profil from "./pages/ProfilPerusahaan";
import Pesan from "./pages/Pesan";
import Testimoni from "./pages/Testimoni";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Pelatihan */}
          <Route
            path="/pelatihan"
            element={
              <PrivateRoute>
                <Pelatihan />
              </PrivateRoute>
            }
          />
          {/* pelatihan/:id */}

          {/* Protected Layanan */}
          <Route
            path="/layanan"
            element={
              <PrivateRoute>
                <Layanan />
              </PrivateRoute>
            }
          />

          {/* Protected Profil */}
          <Route
            path="/profil-perusahaan"
            element={
              <PrivateRoute>
                <Profil />
              </PrivateRoute>
            }
          />

          {/* Protected Pesan Kontak */}
          <Route
            path="/pesan-kontak"
            element={
              <PrivateRoute>
                <Pesan />
              </PrivateRoute>
            }
          />
          {/* /pesan-kontak/:id */}

          {/* Protected Testimoni */}
          <Route
            path="/testimoni"
            element={
              <PrivateRoute>
                <Testimoni />
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
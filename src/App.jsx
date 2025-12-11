import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pelatihan from "./pages/Pelatihan";
import Layanan from "./pages/Layanan";
import Profil from "./pages/ProfilPerusahaan";
import Pesan from "./pages/Pesan";
import Testimoni from "./pages/Testimoni";
import AdminPage from "./pages/Admin"; // Import Admin Page

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/pelatihan" element={<PrivateRoute><Pelatihan /></PrivateRoute>} />
          <Route path="/layanan" element={<PrivateRoute><Layanan /></PrivateRoute>} />
          <Route path="/profil-perusahaan" element={<PrivateRoute><Profil /></PrivateRoute>} />
          <Route path="/pesan-kontak" element={<PrivateRoute><Pesan /></PrivateRoute>} />
          <Route path="/testimoni" element={<PrivateRoute><Testimoni /></PrivateRoute>} />
          
          {/* Admin Route (Hanya bisa diakses jika Sidebar menampilkannya, 
              tapi backend juga akan memblokir request jika bukan superadmin) */}
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
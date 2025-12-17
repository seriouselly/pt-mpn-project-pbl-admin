import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pelatihan from "./pages/Pelatihan";
import Layanan from "./pages/Layanan";
import Profil from "./pages/ProfilPerusahaan";
import Pesan from "./pages/Pesan";
import Testimoni from "./pages/Testimoni";
import AdminPage from "./pages/Admin"; // Import Admin Page
import Partner from "./pages/Partner";
import GalleryAdmin from "./pages/GalleryAdmin";
import DetailJenis from "./pages/DetailJenis";

const SuperAdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== "SUPERADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

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
          <Route path="/partner" element={<PrivateRoute><Partner /></PrivateRoute>} />
          <Route path="/gallery" element={<PrivateRoute><GalleryAdmin /></PrivateRoute>} />
          <Route path="/detail-jenis" element={<PrivateRoute><DetailJenis /></PrivateRoute>} />
          
          {/* Admin Route khusus SUPERADMIN */}
          <Route path="/admin" element={<PrivateRoute><SuperAdminRoute><AdminPage /></SuperAdminRoute></PrivateRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

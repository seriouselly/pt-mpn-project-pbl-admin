import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto redirect jika user sudah login
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const ok = await login(email, password);

    if (!ok) {
      setLoading(false);
      setErrorMsg("Email atau password salah!");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "380px" }}>
        
        {/* Logo */}
        <div className="text-center mb-3">
          <div
            className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2"
            style={{ width: 60, height: 60 }}
          >
            <strong>MPN</strong>
          </div>
          <h4 className="fw-bold">Admin Dashboard</h4>
          <p className="text-muted small">PT MULTIARTHA PUNDIMAS NAWASENA</p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="alert alert-danger py-2 text-center">{errorMsg}</div>
        )}

        {/* Form login */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@mpn.co.id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        {/* Demo credential */}
        <div className="mt-3 p-2 bg-light rounded text-center small text-muted">
          <strong>Demo Login</strong> <br />
          Email: admin@mpn.co.id <br />
          Password: admin123
        </div>
      </div>
    </div>
  );
}

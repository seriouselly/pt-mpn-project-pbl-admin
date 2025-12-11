import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/pages/Login.css";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const result = await login(email, password);

    if (!result.success) {
      setLoading(false);
      setErrorMsg(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">MPN</div>
        <h3 className="login-title">Admin Dashboard</h3>
        <p className="login-subtitle">PT MULTIARTHA PUNDIMAS NAWASENA</p>

        {errorMsg && <div className="login-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-group">
            <label>Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="admin@mpn.co.id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-group">
            <label>Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ModalItem({
  show,
  title,
  fields = [],
  value = {},
  onChange = () => {},
  onSubmit = () => {},
  onClose = () => {},
}) {
  const [showPassword, setShowPassword] = useState({});

  if (!show) return null;

  const handleFieldChange = (name, v) => {
    onChange({ ...value, [name]: v });
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
      }}
    >
      <div
        style={{
          width: 680,
          maxWidth: "95%",
          borderRadius: 12,
          background: "#fff",
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} className="btn btn-ghost">
            Tutup
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {fields.map((f) => (
            <div
              key={f.name}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: 13, marginBottom: 6 }}>{f.label}</label>

              {f.type === "text" && (
                <input
                  className="form-control"
                  value={value[f.name] || ""}
                  onChange={(e) => handleFieldChange(f.name, e.target.value)}
                />
              )}

              {f.type === "password" && (
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword[f.name] ? "text" : "password"}
                    className="form-control"
                    style={{ paddingRight: "40px" }}
                    value={value[f.name] || ""}
                    placeholder={f.placeholder || ""}
                    onChange={(e) => handleFieldChange(f.name, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(f.name)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      color: "#6c757d",
                    }}
                    title={
                      showPassword[f.name]
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword[f.name] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              )}

              {f.type === "textarea" && (
                <textarea
                  className="form-control"
                  rows={f.rows || 3}
                  value={value[f.name] || ""}
                  onChange={(e) => handleFieldChange(f.name, e.target.value)}
                />
              )}

              {f.type === "select" && (
                <select
                  className="form-control"
                  value={value[f.name] || ""}
                  onChange={(e) => handleFieldChange(f.name, e.target.value)}
                >
                  {(f.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {f.type === "foto" && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      // set temporary object for preview and store file
                      const url = URL.createObjectURL(file);
                      handleFieldChange("foto", url);
                      handleFieldChange("foto_file", file);
                    }}
                  />
                  {value && value.foto && (
                    <img
                      src={value.foto}
                      alt="preview"
                      style={{ width: 120, marginTop: 10, borderRadius: 8 }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <button onClick={onClose} className="btn btn-ghost">
            Batal
          </button>
          <button onClick={onSubmit} className="btn btn-primary">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

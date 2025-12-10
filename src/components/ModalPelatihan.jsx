import React from "react";

export default function ModalPelatihan({
  show,
  title,
  fields = [],
  value = {},
  onChange = () => { },
  onSubmit = () => { },
  onClose = () => { },
  readOnly = false,
}) {
  if (!show) return null;

  const handleFieldChange = (name, v) => {
    if (readOnly) return;
    onChange((prevOrValue) => {
      // if parent passed setter directly, allow object or function
      if (typeof prevOrValue === "function") {
        return (prev) => ({ ...prev, [name]: v });
      }
      // otherwise parent setter expects the full object -> call onChange with new object
      return { ...value, [name]: v };
    },
    (onChange));
  };

  // Simpler reliable handler: directly call parent setter if it's a function setForm
  // We'll assume parent passes setForm; fallback to calling onChange with new value
  const safeChange = (name, v) => {
    try {
      // if onChange is React setState setter, it accepts function or value
      onChange((prev) => ({ ...prev, [name]: v }));
    } catch {
      onChange({ ...value, [name]: v });
    }
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
        zIndex: 9999,
      }}
    >
      <div style={{ width: 720, maxWidth: "96%", background: "#fff", borderRadius: 8, padding: 18 }}>
        {/* header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">{title}</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Tutup</button>
        </div>

        {/* fields */}
        <div style={{ display: "grid", gap: 12 }}>
          {fields.map((f) => (
            <div key={f.name}>
              <label className="form-label">{f.label}</label>

              {f.type === "text" && (
                <input
                  className="form-control"
                  disabled={readOnly}
                  value={value[f.name] || ""}
                  onChange={(e) => safeChange(f.name, e.target.value)}
                />
              )}

              {f.type === "textarea" && (
                <textarea
                  className="form-control"
                  disabled={readOnly}
                  rows={f.rows || 3}
                  value={value[f.name] || ""}
                  onChange={(e) => safeChange(f.name, e.target.value)}
                />
              )}

              {f.type === "select" && (
                <select
                  className="form-select"
                  disabled={readOnly}
                  value={value[f.name] || (f.options && f.options[0]) || ""}
                  onChange={(e) => safeChange(f.name, e.target.value)}
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
                  {!readOnly && (
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        safeChange("foto", url);
                        safeChange("foto_file", file);
                      }}
                    />
                  )}

                  {value?.foto && (
                    <img src={value.foto} alt="preview" style={{ width: 160, marginTop: 8, borderRadius: 8, border: "1px solid #eee" }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          {!readOnly && (
            <button className="btn btn-primary" onClick={onSubmit}>Simpan</button>
          )}
        </div>
      </div>
    </div>
  );
}

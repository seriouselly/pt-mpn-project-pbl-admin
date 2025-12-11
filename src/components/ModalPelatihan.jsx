import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ModalPelatihan({ show, title, fields, value, onChange, onSubmit, onClose, readOnly = false }) {
  
  const handleChange = (e) => {
    const { name, value: val, files } = e.target;
    if (files) {
      onChange({ ...value, [name]: URL.createObjectURL(files[0]), [name + "_file"]: files[0] });
    } else {
      onChange({ ...value, [name]: val });
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {fields.map((field) => (
            <Form.Group className="mb-3" key={field.name}>
              <Form.Label className="fw-bold">{field.label}</Form.Label>
              
              {/* --- HANDLING KHUSUS SELECT/DROPDOWN --- */}
              {field.type === "select" ? (
                <Form.Select
                  name={field.name}
                  value={value[field.name] || ""}
                  onChange={handleChange}
                  disabled={readOnly}
                >
                  <option value="">-- Pilih {field.label} --</option>
                  {field.options && field.options.map((opt, idx) => {
                    // Cek apakah opsi berupa object {value, label} atau string biasa
                    const optValue = typeof opt === 'object' ? opt.value : opt;
                    const optLabel = typeof opt === 'object' ? opt.label : opt;
                    return (
                      <option key={idx} value={optValue}>
                        {optLabel}
                      </option>
                    );
                  })}
                </Form.Select>
              
              /* --- HANDLING TEXTAREA --- */
              ) : field.type === "textarea" ? (
                <Form.Control
                  as="textarea"
                  rows={field.rows || 3}
                  name={field.name}
                  value={value[field.name] || ""}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              
              /* --- HANDLING FILE FOTO --- */
              ) : field.type === "foto" ? (
                <div>
                  {!readOnly && <Form.Control type="file" name={field.name} onChange={handleChange} accept="image/*" className="mb-2" />}
                  {value[field.name] && (
                    <div className="border p-1 rounded d-inline-block">
                      <img src={value[field.name]} alt="Preview" style={{ maxHeight: "150px", maxWidth: "100%" }} />
                    </div>
                  )}
                </div>
              
              /* --- HANDLING INPUT BIASA --- */
              ) : (
                <Form.Control
                  type={field.type}
                  name={field.name}
                  value={value[field.name] || ""}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Tutup</Button>
        {!readOnly && (
          <Button variant="primary" onClick={onSubmit}>Simpan</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
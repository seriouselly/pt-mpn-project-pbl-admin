import DashboardLayout from '../components/layout/DashboardLayout'
import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Eye, Trash2, Pen, X, Search, Mail } from "lucide-react";
import "../styles/pages/Pelatihan.css";
import trainings from "../data/training";

function Pelatihan() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // add | edit | view
  const [selectedData, setSelectedData] = useState(null);
  const [trainingsData, setTrainingsData] = useState(trainings);
  const [formValues, setFormValues] = useState({
    title: "",
    shortDesc: "",
    category: "",
    duration: "",
    status: "Publish",
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShow = (type, data = null) => {
    setModalType(type);
    setSelectedData(data);
    // populate form values for add/edit
    if (type === "add") {
      setFormValues({ title: "", shortDesc: "", category: "", image: "", detail: "", materials: ""});
    } else if (data) {
      setFormValues({
        title: data.title || "",
        shortDesc: data.shortDesc || "",
        category: data.category || "",
        image: data.image || "",
        detail: data.detail || "",
        materials: data.materials|| ""
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleView = (item) => {
    handleShow("view", item);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Hapus pelatihan ini?")) return;
    setTrainingsData((prev) => prev.filter((t) => t.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (modalType === "add") {
      const newId = trainingsData.length ? Math.max(...trainingsData.map((t) => t.id)) + 1 : 1;
      const newItem = { id: newId, ...formValues };
      setTrainingsData((prev) => [newItem, ...prev]);
    } else if (modalType === "edit" && selectedData) {
      setTrainingsData((prev) => prev.map((t) => (t.id === selectedData.id ? { ...t, ...formValues } : t)));
    }
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">

        {/* HEADER PAGE */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark">Manajemen Pelatihan</h2>
            <p className="text-muted mb-0">Kelola semua program pelatihan</p>
          </div>
          <Button variant="primary" onClick={() => handleShow("add")}>
            + Tambah Pelatihan
          </Button>
        </div>

        {/* SEARCH BAR */}
        <div className="pelatihan-container">
          {/* Search Bar */}
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-input w-100"
              placeholder="Cari Pelatihan berdasarkan nama, kategori, atau durasi"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Nama Pelatihan</th>
                  <th style={{ width: '50%' }}>Deskripsi</th>
                  <th className="text-center" style={{ width: '15%' }}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {trainings.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <strong className="fw-semibold">{item.title}</strong>
                    </td>

                    <td className='p-3'>{item.shortDesc}</td>
                    <td className="d-flex gap-2 p-3 text-center justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-primary border-0 p-1"
                        onClick={() => handleView(item)}
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger border-0 p-1"
                        onClick={() => handleDelete(item.id)}
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "add" && "Tambah Pelatihan"}
              {modalType === "edit" && "Edit Pelatihan"}
              {modalType === "view" && "Detail Pelatihan"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {modalType === "view" ? (
              <>
                <p><strong>Nama:</strong> {selectedData?.title}</p>
                <p><strong>Deskripsi:</strong> {selectedData?.shortDesc}</p>
                <p><strong>Deskripsi Lengkap:</strong> {selectedData?.longDesc}</p>
                <p><strong>Kategori:</strong> {selectedData?.category}</p>
                <p><strong>Image:</strong> {selectedData?.category}</p>
                <p><strong>Detail Pelatihan:</strong></p>
                <ul>
                  {selectedData?.detail?.map((detailItem, index) => (
                    <li key={index}>{detailItem}</li>
                  ))}
                </ul>
                <p><strong>Materi Pelatihan:</strong></p>
                <ul>
                  {selectedData?.materials?.map((materialItem, index) => (
                    <li key={index}>{materialItem}</li>
                  ))}
                </ul>
              </>
            ) : (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Pelatihan</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formValues.title}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shortDesc"
                    value={formValues.shortDesc}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formValues.category}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Durasi</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={formValues.duration}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={formValues.status} onChange={handleInputChange}>
                    <option>Publish</option>
                    <option>Draft</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>

          {modalType !== "view" && (
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Batal
              </Button>
              <Button variant="primary" onClick={handleSave}>Simpan</Button>
            </Modal.Footer>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )

}
export default Pelatihan;
const KEY = "app_layanan_v1";
const seed = [
  { id: 1, nama: "Layanan Konsultasi", deskripsi: "Konsultasi belajar dan karir", status: "Active" },
  { id: 2, nama: "Layanan Pelatihan", deskripsi: "Pelatihan skill profesional", status: "Active" },
  { id: 3, nama: "Layanan Mentoring", deskripsi: "Sesi mentoring 1-on-1", status: "Inactive" },
];

function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return [...seed];
  }
  return JSON.parse(raw);
}
function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }

export async function getLayanan() { return { data: load() }; }
export async function createLayanan(item) {
  const db = load();
  const newItem = { ...item, id: Date.now() };
  db.push(newItem); save(db); return { data: newItem };
}
export async function updateLayanan(id, item) {
  const db = load().map(d => d.id === id ? { ...d, ...item } : d);
  save(db); return { success: true };
}
export async function deleteLayanan(id) {
  const db = load().filter(d => d.id !== id); save(db); return { success: true };
}
export async function resetDatabase() {
  localStorage.setItem(KEY, JSON.stringify(seed)); return { success: true };
}

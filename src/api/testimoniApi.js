const KEY = "app_testimoni_v1";
const seed = [
  { id: 1, nama: "Andi", testimoni: "Sangat membantu!", foto: "" },
  { id: 2, nama: "Budi", testimoni: "Pelayanan cepat.", foto: "" },
];

function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return [...seed]; }
  return JSON.parse(raw);
}
function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

export async function getTestimoni() { return { data: load() }; }
export async function createTestimoni(item) {
  const db = load();
  const newItem = { ...item, id: Date.now() };
  db.push(newItem); save(db); return { data: newItem };
}
export async function updateTestimoni(id, item) {
  const db = load().map(d => d.id === id ? { ...d, ...item } : d);
  save(db); return { success: true };
}
export async function deleteTestimoni(id) {
  const db = load().filter(d => d.id !== id); save(db); return { success: true };
}

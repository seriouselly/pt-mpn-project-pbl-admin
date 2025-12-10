import trainings from "../data/training";

const KEY = "app_pelatihan_v1";

/* --- 1. Membuat seed agar langsung mengikuti data training.js --- */
const seed = trainings.map((d) => ({
  ...d,
  id: d.id ?? Date.now() + Math.random()  // fallback jika tidak ada id
}));

/* --- 2. Load database dari localStorage atau gunakan seed --- */
function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    // pertama kali aplikasi jalan → simpan data training.js
    localStorage.setItem(KEY, JSON.stringify(seed));
    return [...seed];
  }
  return JSON.parse(raw);
}

/* --- 3. Save helper --- */
function save(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

/* --- 4. CRUD API --- */
export async function getPelatihan() {
  return { data: load() };
}

export async function createPelatihan(item) {
  const db = load();
  const newItem = { ...item, id: Date.now() };
  db.push(newItem);
  save(db);
  return { data: newItem };
}

export async function updatePelatihan(id, item) {
  const db = load().map((d) => (d.id === id ? { ...d, ...item } : d));
  save(db);
  return { success: true };
}

export async function deletePelatihan(id) {
  const db = load().filter((d) => d.id !== id);
  save(db);
  return { success: true };
}

/* --- 5. Reset database agar kembali mengikuti training.js --- */
export async function resetDatabase() {
  save(seed);
  return { success: true };
}

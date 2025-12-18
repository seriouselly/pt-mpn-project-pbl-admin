// import axiosClient from "./axiosClient";

// const BASE = "/api/detail-jenis-bidang-usaha";

// const normalizeList = (res) => {
//   if (Array.isArray(res.data)) return res.data;
//   if (Array.isArray(res.data?.data)) return res.data.data;
//   return [];
// };

// const tryPaths = async (method, paths, payload) => {
//   let lastErr;
//   for (const path of paths) {
//     try {
//       const res = await axiosClient.request({ method, url: path, data: payload });
//       return res;
//     } catch (err) {
//       lastErr = err;
//       if (err.response?.status !== 404) throw err;
//     }
//   }
//   throw lastErr;
// };

// export async function getDetailJenis() {
//   const res = await axiosClient.get(BASE);
//   return normalizeList(res);
// }

// export async function createDetailJenis(payload) {
//   const nama = payload.nama || payload.nama_detail || payload.title;
//   const jenisId = payload.jenisUsahaId || payload.id_jenis_usaha || payload.jenis_usaha || payload.jenisId;
//   const candidates = [
//     { nama, jenis_usaha: jenisId },
//     { nama, jenisUsahaId: jenisId },
//     { nama, id_jenis_usaha: jenisId },
//     { nama, jenis_usaha: { connect: { id: jenisId } } },
//     { nama },
//   ];

//   let lastErr;
//   for (const body of candidates) {
//     try {
//       const res = await tryPaths("post", [`${BASE}/add`, BASE, `${BASE}/create`], body);
//       return res.data;
//     } catch (err) {
//       lastErr = err;
//       if (err.response?.status !== 404) {
//         // Continue trying next candidate if 400, but bubble up non-404
//         if (err.response?.status !== 400) throw err;
//       }
//     }
//   }
//   if (lastErr) throw lastErr;
// }

// export async function updateDetailJenis(id, payload) {
//   const nama = payload.nama || payload.nama_detail || payload.title;
//   const jenisId = payload.jenisUsahaId || payload.id_jenis_usaha || payload.jenis_usaha || payload.jenisId;
//   const candidates = [
//     { nama, jenis_usaha: jenisId },
//     { nama, jenisUsahaId: jenisId },
//     { nama, id_jenis_usaha: jenisId },
//     { nama, jenis_usaha: { connect: { id: jenisId } } },
//     { nama },
//   ];

//   let lastErr;
//   for (const body of candidates) {
//     try {
//       const res = await tryPaths("put", [`${BASE}/${id}`, `${BASE}/update/${id}`], body);
//       return res.data;
//     } catch (err) {
//       lastErr = err;
//       if (err.response?.status !== 404) {
//         if (err.response?.status !== 400) throw err;
//       }
//     }
//   }
//   if (lastErr) throw lastErr;
// }

// export async function deleteDetailJenis(id) {
//   const res = await axiosClient.delete(`${BASE}/${id}`);
//   return res.data;
// }

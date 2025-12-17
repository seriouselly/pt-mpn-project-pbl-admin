export function resolveUploadUrl(baseUrl, path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const safeBase = (baseUrl || "http://202.10.47.174:8000").replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withUploads = normalized.startsWith("/uploads/")
    ? normalized
    : `/uploads${normalized}`;

  return `${safeBase}${withUploads}`;
}

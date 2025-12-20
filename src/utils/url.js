export function resolveUploadUrl(baseUrl, path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const safeBase = (baseUrl || "http://202.10.47.174:8000").replace(/\/$/, "");

  // Normalize path: remove leading slash if exists, remove 'uploads/' prefix if exists
  let normalized = path.replace(/^\/+/, ""); // Remove leading slashes
  normalized = normalized.replace(/^uploads\//, ""); // Remove 'uploads/' prefix if exists

  // Build final URL
  return `${safeBase}/uploads/${normalized}`;
}

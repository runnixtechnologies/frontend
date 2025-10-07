export function getImageUrl(imgPath?: string | null): string | null {
  if (!imgPath) return null
  const s = imgPath.trim()
  if (!s) return null
  // already absolute or root-relative
  if (
    s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.startsWith("/")
  ) {
    return s
  }
  const base = process.env.NEXT_PUBLIC_FILE_BASE_URL?.replace(/\/+$/, "") ?? ""
  return base ? `${base}/${s.replace(/^\/+/, "")}` : `/${s.replace(/^\/+/, "")}`
}

import type { ApiUser } from "@/lib/redux/api/users"

export function getDisplayName(u?: ApiUser): string {
  if (!u) return "—"
  if (u.role === "merchant" && u.store?.store_name) {
    return u.store.store_name
  }
  const rFirst = u.rider?.first_name ?? ""
  const rLast = u.rider?.last_name ?? ""
  const pFirst = u.profile?.first_name ?? ""
  const pLast = u.profile?.last_name ?? ""
  const full = [rFirst || pFirst, rLast || pLast].filter(Boolean).join(" ")
  return full || u.email || u.phone || "—"
}

export function getAvatarUrl(u?: ApiUser): string | null {
  if (!u) return null
  return (
    u.store?.biz_logo || // merchants first
    u.profile?.profile_image ||
    (u as any)?.profile?.profile_picture ||
    u.rider?.profile_image ||
    null
  )
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "US"
}

export function getWalletNaira(u?: ApiUser): string {
  const balance = u?.wallet?.balance
  const n = Number(balance ?? 0)
  return `₦${n.toLocaleString("en-NG")}`
}
export function mapStatusNumericToText(s: number | string | undefined) {
  const v = String(s ?? "").toLowerCase()
  if (v === "1" || v === "active") return "active"
  if (v === "0" || v === "inactive") return "inactive"
  if (v === "2" || v === "suspended") return "suspended"
  return "unknown"
}

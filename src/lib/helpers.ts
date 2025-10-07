import { ApiUser } from "./redux/api/users"
import { User } from "@/types/users"

const fmtMoney = (val?: string | number | null) =>
  `₦ ${Number(val ?? 0).toLocaleString("en-NG")}`

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString() : "—"

/** Adapter: ApiUser -> this page's User */
export function apiToPageUser(u: ApiUser): User {
  const first = u.profile?.first_name ?? ""
  const last = u.profile?.last_name ?? ""
  const name =
    [first, last].filter(Boolean).join(" ") || u.email || u.phone || "—"

  // Map backend status -> UI status
  let status: User["status"]
  if (u.status === 1) {
    status = "Active"
  } else if (u.status === 0) {
    status = "Inactive"
  } else if (u.status === -1) {
    status = "Suspended"
  } else {
    status = "Inactive" // fallback
  }

  return {
    id: u.id,
    name,
    type: u.role || "-",
    email: u.email ?? "—",
    phone: u.phone ?? "—",
    earning: fmtMoney((u as any)?.wallet?.balance),
    gender: u.profile?.gender ?? "—",
    joined: fmtDate(u.created_at),
    trips: 0,
    imgUrl:
      u.profile?.profile_image ??
      (u as any)?.profile?.profile_picture ??
      "/images/riders/rider-1.jpg",
    category: "-",
    status,
  }
}

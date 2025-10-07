// src/lib/redux/users/toLocalUser.ts
import type { ApiUser, User } from "../api/users"

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString() : "—"

export function toLocalUser(u: ApiUser): User {
  const first = u.profile?.first_name ?? ""
  const last = u.profile?.last_name ?? ""
  const name =
    [first, last].filter(Boolean).join(" ") || u.email || u.phone || "—"

  // status is numeric in your payload: 1=active, 0=inactive, (anything else)=suspended
  let status: User["status"]
  switch (u.status) {
    case 1:
      status = "active"
      break
    case 0:
      status = "inactive"
      break
    default:
      status = "suspended"
  }

  return {
    id: u.id,
    name,
    email: u.email ?? "—",
    phone: u.phone ?? "—",
    gender: u.profile?.gender ?? "—",
    status,
    joined: fmtDate(u.created_at),
    balance: u.wallet?.balance ?? "0.00",
  }
}

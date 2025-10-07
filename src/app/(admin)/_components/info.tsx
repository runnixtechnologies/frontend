// src/app/(admin)/admin/users/[userId]/_components/user-information.tsx
"use client"

import { Label } from "@/components/ui/label"
import { useGetSingleUserQuery, type ApiUser } from "@/lib/redux/api/users"
import { useMemo } from "react"

type Props = {
  /** Numeric id from the route */
  userId: number
  /** Which collection to query on your backend */
  userType: "user" | "rider" | "merchant"
}

function formatDate(input?: string | null) {
  if (!input) return "—"
  const d = new Date(input)
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

export default function UserInformation({ userId, userType }: Props) {
  const { data, isLoading, isError, error, refetch } = useGetSingleUserQuery(
    { userType, id: userId },
    { skip: !userId }
  )

  // Many APIs wrap the payload in { data }, but your slice already returns either the
  // envelope or the raw object. This keeps us defensive:
  const user: ApiUser | undefined = useMemo(() => {
    const r: any = data
    return r?.data ?? r
  }, [data])

  const profile = user?.profile ?? (user as any)?.profile ?? undefined

  const firstName = profile?.first_name ?? "—"
  const lastName = profile?.last_name ?? "—"
  const email = user?.email ?? "—"
  const phone = user?.phone ?? "—"
  const gender =
    (profile?.gender as string | null | undefined) ??
    (user as any)?.gender ??
    "—"
  const dob = formatDate(profile?.dob ?? (user as any)?.dob ?? null)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md border p-4">
        <p className="text-sm text-red-600">
          Failed to load user info
          {(error as any)?.data?.message
            ? `: ${(error as any).data.message}`
            : "."}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-primary underline text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label
          htmlFor="firstName"
          className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
        >
          First Name
        </Label>
        <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
          {firstName}
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="lastName"
          className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
        >
          Last Name
        </Label>
        <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
          {lastName}
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
        >
          Email Address
        </Label>
        <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
          {email}
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
        >
          Phone Number
        </Label>
        <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
          {phone}
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="gender"
          className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
        >
          Gender
        </Label>
        <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
          {gender ?? "—"}
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="dob"
          className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
        >
          Date of Birth
        </Label>
        <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
          {dob}
        </p>
      </div>
    </div>
  )
}

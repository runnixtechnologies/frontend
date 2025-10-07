"use client"

import { Button } from "@/components/ui/button"
import type { ApiUser, GetAllUsersResponse } from "@/lib/redux/api/users"
import {
  useGetAllUsersQuery,
  useGetUserStatsQuery,
} from "@/lib/redux/api/users"
import { useMemo, useState } from "react"
import { UserFilters, type UserFilterValues } from "./users-filters"
import { UserStats } from "./users-stats"
import { UsersTable } from "./users-table"
import UserTabs, { TabKey } from "./users-tab"

export interface User {
  id: number
  name: string
  type: string
  email: string
  phone: string
  earning: string
  gender: string
  joined: string
  trips: number
  imgUrl: string
  category: string
  status: "Active" | "Inactive" | "Suspended"
}

/* ---------- helpers for this page ---------- */
const fmtMoney = (val?: string | number | null) =>
  `₦ ${Number(val ?? 0).toLocaleString("en-NG")}`

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString() : "—"

/** Adapter: ApiUser -> this page's User */
function apiToPageUser(u: ApiUser): User {
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

export default function AllUsers({
  userType,
  page,
}: {
  userType: "user" | "rider" | "merchant"
  page: "users" | "riders" | "merchants"
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [filters, setFilters] = useState<UserFilterValues>({
    searchQuery: "",
  })

  /* ---------- Tab counts from server stats ---------- */
  const { data: statsData } = useGetUserStatsQuery({ userType })

  const apiArgs = useMemo(() => {
    const status =
      activeTab === "all"
        ? undefined
        : activeTab === "active"
        ? "1"
        : activeTab === "inactive"
        ? "0"
        : "-1"
    const search = filters.searchQuery?.trim() || undefined
    const is_verified = undefined as undefined | boolean | 0 | 1

    return { userType, status, search, is_verified }
  }, [activeTab, userType, filters.searchQuery])

  const {
    data: resp,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllUsersQuery(apiArgs)

  /* ---------- Normalize data from API (supports both shapes) ---------- */
  const users: User[] = useMemo(() => {
    if (!resp) return []
    if (Array.isArray(resp)) return resp as unknown as User[]
    const r = resp as GetAllUsersResponse
    const arr: ApiUser[] = r?.data?.data ?? []
    return arr.map(apiToPageUser)
  }, [resp])

  /* ---------- Tab counts: server stats first, otherwise local fallback ---------- */
  const tabCounts = useMemo<Record<TabKey, number>>(() => {
    if (statsData) {
      const active = statsData.active ?? 0
      const inactive = statsData.inactive ?? 0
      const suspended = statsData.suspended ?? 0
      return {
        all: active + inactive + suspended,
        active,
        inactive,
        suspended,
        is_verified: "",
      }
    }
    return {
      all: users.length,
      active: users.filter((d) => d.status === "Active").length,
      inactive: users.filter((d) => d.status === "Inactive").length,
      suspended: users.filter((d) => d.status === "Suspended").length,
    }
  }, [statsData, users])

  /* ---------- Loading / Error ---------- */
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-lg border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
            <div className="h-64 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-lg border p-6">
          <p className="text-red-600 mb-3">
            Failed to load users
            {(error as any)?.data?.message
              ? `: ${(error as any).data.message}`
              : "."}
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  /* ---------- Render ---------- */
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <UserStats type={userType} />

      <div className="w-full bg-white rounded-lg border flex flex-col gap-3">
        <div className="w-full flex justify-between gap-2 pt-6 pb-5 px-6">
          <UserTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            size={users?.length}
            tabCounts={tabCounts}
          />
          <UserFilters
            onFilterChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
          />
        </div>

        <UsersTable filters={filters} data={users} page={page} />
      </div>
    </div>
  )
}

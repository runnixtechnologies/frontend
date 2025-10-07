"use client"

import type { GetDeliveriesArgs } from "@/lib/redux/api/deliveries"
import {
  useGetAllDeliveriesQuery,
  type DeliveryRow,
} from "@/lib/redux/api/deliveries"
import { useEffect, useMemo, useState } from "react"
import {
  DeliveryFilters,
  type DeliveryFilterValues,
} from "./_components/filters"
import { DeliveryStats } from "./_components/stats"
import { DeliveryTable } from "./_components/table"
import { DeliveryTabs } from "./_components/tabs"

/* ---- date helpers ---- */
const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
const ymd = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function startOfWeek(d = new Date()) {
  const dow = d.getDay() || 7
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  copy.setDate(copy.getDate() - (dow - 1))
  return copy
}
function endOfWeek(d = new Date()) {
  const s = startOfWeek(d)
  const e = new Date(s)
  e.setDate(s.getDate() + 6)
  e.setHours(23, 59, 59, 999)
  return e
}
function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}
function rangeToDates(range: string) {
  const now = new Date()
  if (range === "today") return { date_from: ymd(now), date_to: ymd(now) }
  if (range === "yesterday") {
    const y = new Date(now)
    y.setDate(now.getDate() - 1)
    return { date_from: ymd(y), date_to: ymd(y) }
  }
  if (range === "this-week")
    return { date_from: ymd(startOfWeek(now)), date_to: ymd(now) }
  if (range === "last-week") {
    const lastSun = new Date(startOfWeek(now))
    lastSun.setDate(lastSun.getDate() - 1)
    return {
      date_from: ymd(startOfWeek(lastSun)),
      date_to: ymd(endOfWeek(lastSun)),
    }
  }
  if (range === "this-month")
    return { date_from: ymd(startOfMonth(now)), date_to: ymd(now) }
  if (range === "last-month") {
    const firstThis = startOfMonth(now)
    const lastMonthEnd = new Date(firstThis)
    lastMonthEnd.setDate(0)
    const lastMonthStart = startOfMonth(lastMonthEnd)
    return { date_from: ymd(lastMonthStart), date_to: ymd(lastMonthEnd) }
  }
  return { date_from: undefined, date_to: undefined }
}

export default function DeliveriesPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "in-transit" | "pending" | "completed" | "cancelled"
  >("in-transit")

  const [filters, setFilters] = useState<DeliveryFilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    dateRange: "all-time",
    searchQuery: "",
  })

  // Map tab → API status
  const statusForTab = useMemo<string | undefined>(() => {
    switch (activeTab) {
      case "in-transit":
        return "in_transit"
      case "pending":
        return "pending"
      case "completed":
        return "completed"
      case "cancelled":
        return "cancelled"
      default:
        return undefined
    }
  }, [activeTab])

  // Dialog filters to CSV
  const statusCsvFromDialog = useMemo<string | undefined>(() => {
    if (!filters.status?.length) return undefined
    const map: Record<string, string> = {
      "in-transit": "in_transit",
      pending: "pending",
      completed: "completed",
      cancelled: "cancelled",
    }
    return filters.status.map((s) => map[s] ?? s).join(",")
  }, [filters.status])

  const finalStatusParam = statusForTab ?? statusCsvFromDialog

  useEffect(() => {
    if (activeTab === "all") return
    setFilters((prev) => ({ ...prev, status: [activeTab] }))
  }, [activeTab])

  // Dates
  const { date_from, date_to } = useMemo(
    () => rangeToDates(filters.dateRange),
    [filters.dateRange]
  )

  // Pagination
  const [page, setPage] = useState(1)
  const limit = 10

  // Args for deliveries slice
  const args: GetDeliveriesArgs = useMemo(() => {
    const search = filters.searchQuery?.trim() || undefined
    const status = finalStatusParam || undefined
    return {
      page,
      limit,
      search,
      status,
      storeid: undefined,
      riderid: undefined,
      package_number: undefined,
      delivered_at: undefined,
      date_from,
      date_to,
    }
  }, [page, limit, filters.searchQuery, finalStatusParam, date_from, date_to])

  const { data, isLoading, isError, error } = useGetAllDeliveriesQuery(args)

  const rows: DeliveryRow[] = useMemo(() => data?.rows ?? [], [data?.rows])
  const currentPage = data?.page ?? 1
  const lastPage = data?.lastPage ?? 1
  const pages = useMemo(
    () => Array.from({ length: Math.max(1, lastPage) }, (_, i) => i + 1),
    [lastPage]
  )

  // Count for tabs
  const tabCounts = useMemo(() => {
    const normalize = (s: string) => s.toLowerCase().replace("_", "-")
    return {
      all: rows.length,
      "in-transit": rows.filter((r) => normalize(r.status) === "in-transit")
        .length,
      pending: rows.filter((r) => normalize(r.status) === "pending").length,
      completed: rows.filter((r) => normalize(r.status) === "completed").length,
      cancelled: rows.filter((r) => normalize(r.status) === "cancelled").length,
    }
  }, [rows])
  const handleFilterChange = (next: DeliveryFilterValues) => {
    if (activeTab !== "all") {
      next = { ...next, status: [activeTab] }
    }
    setFilters(next)
    setPage(1)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DeliveryStats />

      <div className="w-full bg-white rounded-lg border flex flex-col gap-3">
        <div className="w-full flex justify-between gap-2 pt-6 pb-5 px-6">
          <DeliveryTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            size={rows.length}
            tabCounts={tabCounts}
          />
          <DeliveryFilters
            value={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <DeliveryTable
          filters={filters}
          deliveries={rows}
          isLoading={isLoading}
          isError={isError}
          error={error}
          page={currentPage}
          pages={pages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

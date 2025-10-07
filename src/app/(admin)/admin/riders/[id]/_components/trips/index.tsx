"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TripsFilters } from "./filter"
import { OrderStats } from "@/app/(admin)/_components/orders/stats"
import { useGetAllOrdersQuery, type OrderRow } from "@/lib/redux/api/orders"

export type RiderFilterValues = {
  type: string
  location: string
  category: string
  status: string[] // ["Pending","Completed",...]
  dateRange: string
  searchQuery: string
}

type TripsTableProps = {
  riderId: number | string
  pageSize?: number
}

const statusBadgeClass: Record<OrderRow["status"], string> = {
  Completed: "bg-[#EEFFF1] text-[#01B833]",
  "in-transit": "bg-[#F0EEF9] text-primary",
  Pending: "bg-[#FFF3ED] text-[#FF875C]",
  Cancelled: "bg-[#FFE1E1] text-[#F83B3B]",
}

function renderStatusBadge(status: OrderRow["status"]) {
  const cls = statusBadgeClass[status] ?? "bg-gray-100 text-gray-600"
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}

/** Map UI multi-select to API single status value */
function uiToApiStatus(ui: string[] | undefined): string | undefined {
  if (!ui || ui.length === 0) return undefined
  const s = ui[0].toLowerCase()
  if (s === "completed") return "completed"
  if (s === "cancelled") return "cancelled"
  if (s === "in-transit" || s === "in_transit") return "in_transit"
  return "pending"
}

export function TripsTable({ riderId, pageSize = 10 }: TripsTableProps) {
  const [filters, setFilters] = React.useState<RiderFilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    category: "",
    dateRange: "all-time",
    searchQuery: "",
  })
  const [page, setPage] = React.useState(1)

  const apiStatus = React.useMemo(
    () => uiToApiStatus(filters.status),
    [filters.status]
  )

  const { data, isLoading, isError, error, refetch } = useGetAllOrdersQuery({
    page,
    limit: pageSize,
    riderid: riderId, // ← filter by this rider
    status: apiStatus, // optional server-side status filter
    // You can also map filters.dateRange → date_from/date_to here if needed
  })

  const allRows = React.useMemo(() => data?.rows ?? [], [data])

  const rows = React.useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase()
    if (!q) return allRows
    return allRows.filter(
      (r) =>
        r.user.toLowerCase().includes(q) ||
        r.rider.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q)
    )
  }, [allRows, filters.searchQuery])
  const lastPage = data?.lastPage ?? 1
  const pages = React.useMemo(
    () => Array.from({ length: Math.max(1, lastPage) }, (_, i) => i + 1),
    [lastPage]
  )

  const changePage = (p: number) => {
    const next = Math.max(1, Math.min(lastPage || 1, p))
    setPage(next)
    document
      .querySelector(".rounded-md.border")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleFilterChange = (next: Partial<RiderFilterValues>) => {
    setPage(1) // reset to page 1 on filter changes
    setFilters((prev) => ({ ...prev, ...next }))
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Rider stats header (backed by /order-stats) */}
      <OrderStats userId={riderId} />

      <div className="w-full flex flex-col items-center xl:flex-row gap-2 h-[96px] pt-6 pb-5 px-6 justify-between">
        <h2 className="text-[#191A1A] font-figtree font-bold text-[24px]/[32px] -tracking-[2%]">
          Orders
        </h2>
        <TripsFilters onFilterChange={handleFilterChange} />
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-[44px] bg-[#EFEFEF] border-y border-[#F2F2F2]">
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Rider Name</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Packs</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>End time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9}>Loading…</TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-red-600">
                    Failed to load trips
                    {(error as any)?.data?.message
                      ? `: ${(error as any).data.message}`
                      : ""}
                    <button
                      onClick={() => refetch()}
                      className="ml-2 text-primary underline"
                    >
                      Retry
                    </button>
                  </TableCell>
                </TableRow>
              ) : rows.length > 0 ? (
                rows.map((d) => (
                  <TableRow key={d.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex flex-col font-figtree font-semibold text-[12px]">
                        {d.date}
                        <span className="text-[10px] font-normal">
                          {d.time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{d.user}</TableCell>
                    <TableCell>{d.rider}</TableCell>
                    <TableCell>{d.fee}</TableCell>
                    <TableCell>{d.packs}</TableCell>
                    <TableCell className="max-w-[220px] whitespace-normal break-words">
                      {d.destination}
                    </TableCell>
                    <TableCell className="max-w-[150px] whitespace-normal break-words">
                      {d.ends}
                    </TableCell>
                    <TableCell>{d.duration}</TableCell>
                    <TableCell>{renderStatusBadge(d.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No trips match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent className="flex gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(page - 1)
                  }}
                  disabled={page <= 1}
                />
              </PaginationItem>

              {pages.map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    isActive={n === page}
                    onClick={(e) => {
                      e.preventDefault()
                      changePage(n)
                    }}
                    size="icon"
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(page + 1)
                  }}
                  disabled={page >= (pages.at(-1) ?? 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

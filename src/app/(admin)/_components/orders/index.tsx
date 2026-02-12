"use client"

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
import { useMemo, useState } from "react"
import { OrderStats } from "./stats"
import { TripsFilters } from "./filter"
import { useGetAllOrdersQuery } from "@/lib/redux/api/orders"
import type { OrderRow } from "@/lib/redux/api/orders"

export type OrderFilterValues = {
  status: string[]
  dateRange: string
  searchQuery: string
}

export function OrdersTable({ userId }: { userId: number }) {
  const [filters, setFilters] = useState<OrderFilterValues>({
    status: [],
    dateRange: "all-time",
    searchQuery: "",
  })

  const [page, setPage] = useState(1)
  const limit = 10

  // Map UI chips -> backend statuses (CSV)
  // UI shows: "Completed" | "Cancelled" | "in-transit" | "Pending"
  const statusCsv = useMemo(() => {
    if (!filters.status.length) return undefined
    const map: Record<string, string> = {
      Completed: "completed",
      Cancelled: "cancelled",
      "in-transit": "in_transit",
      Pending: "pending",
    }
    return filters.status.map((s) => map[s] ?? s).join(",")
  }, [filters.status])

  const { data, isLoading, isError, error } = useGetAllOrdersQuery({
    user_id: userId,
    page,
    limit,
    status: statusCsv,
    search: filters.searchQuery || undefined,
  })

  // `data.rows` already contains OrderRow[] (mapped in the API slice)
  const rows: OrderRow[] = useMemo(() => data?.rows ?? [], [data])
  const currentPage = data?.page ?? 1
  const lastPage = data?.lastPage ?? 1

  const pages = useMemo(
    () => Array.from({ length: Math.max(1, lastPage) }, (_, i) => i + 1),
    [lastPage]
  )

  const changePage = (p: number) => {
    const next = Math.max(1, Math.min(lastPage, p))
    setPage(next)
    document
      .querySelector(".rounded-md.border")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Render UI statuses that come from OrderRow["status"]
  const renderStatusBadge = (status: OrderRow["status"]) => {
    const statusStyles = {
      Completed: "bg-[#EEFFF1] text-[#01B833]",
      "in-transit": "bg-[#F0EEF9] text-primary",
      Pending: "bg-[#FFF3ED] text-[#FF875C]",
      Cancelled: "bg-[#FFE1E1] text-[#F83B3B]",
    } as const
    const style = statusStyles[status] || "bg-gray-100 text-gray-600"
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${style}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <OrderStats userId={userId} />

      <div className="w-full flex flex-col items-center xl:flex-row gap-2 h-24 pt-6 pb-5 px-6 justify-between">
        <h2 className="text-[#191A1A] font-figtree font-bold text-[24px]/[32px] -tracking-[2%]">
          Orders
        </h2>
        <TripsFilters
          onFilterChange={(nf) => setFilters((p) => ({ ...p, ...nf }))}
        />
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-11 bg-[#EFEFEF] border-y border-[#F2F2F2]">
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
                    Failed to load orders
                    {(error as any)?.data?.message
                      ? `: ${(error as any).data.message}`
                      : ""}
                  </TableCell>
                </TableRow>
              ) : rows.length > 0 ? (
                rows.map((d) => (
                  <TableRow
                    key={d.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex flex-col font-figtree font-semibold text-[12px]/[133%] -tracking-[2%]">
                        {d.date}
                        <span className="text-[10px]/[133%] font-normal">
                          {d.time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{d.user}</TableCell>
                    <TableCell>{d.rider}</TableCell>
                    <TableCell>{d.fee}</TableCell>
                    <TableCell>{d.packs}</TableCell>
                    <TableCell className="max-w-[150px] whitespace-normal wrap-break-words">
                      {d.destination}
                    </TableCell>
                    <TableCell className="max-w-[150px] whitespace-normal wrap-break-words">
                      {d.ends}
                    </TableCell>
                    <TableCell>{d.duration}</TableCell>
                    <TableCell>{renderStatusBadge(d.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent className="flex gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(currentPage - 1)
                  }}
                  disabled={currentPage <= 1}
                />
              </PaginationItem>

              {pages.map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    isActive={n === currentPage}
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
                    changePage(currentPage + 1)
                  }}
                  disabled={currentPage >= lastPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

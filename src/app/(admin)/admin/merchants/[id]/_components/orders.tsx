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
import { useGetAllOrdersQuery, type OrderRow } from "@/lib/redux/api/orders"
import { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import * as React from "react"

type OrdersTableProps = {
  /** Filter by user id (your UserDetailPage uses this) */
  userId?: number | string
  storeId?: number | string
  riderId?: number | string
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
  pageSize?: number
}
function isFetchBaseQueryError(e: unknown): e is FetchBaseQueryError {
  return typeof e === "object" && e !== null && "status" in e
}
function isSerializedError(e: unknown): e is SerializedError {
  return typeof e === "object" && e !== null && "message" in e
}
function getErrorMessage(
  e: FetchBaseQueryError | SerializedError | undefined
): string {
  if (!e) return ""
  if (isFetchBaseQueryError(e)) {
    // Common API shape: { message: string }
    const data = (e as FetchBaseQueryError).data
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as any).message === "string"
    ) {
      return (data as any).message as string
    }
    if ("error" in e && typeof e.error === "string") return e.error
    try {
      return typeof data === "string" ? data : JSON.stringify(data)
    } catch {
      return String(data)
    }
  }
  if (isSerializedError(e) && typeof e.message === "string") return e.message
  return ""
}

export function OrdersTable({
  userId,
  storeId,
  riderId,
  status,
  search,
  dateFrom,
  dateTo,
  pageSize = 10,
}: OrdersTableProps) {
  const [page, setPage] = React.useState(1)
  const { data, isLoading, isError, error, refetch } = useGetAllOrdersQuery({
    page,
    limit: pageSize,
    user_id: userId, // ← this is what your page passes
    storeid: storeId, // supported by your API slice
    riderid: riderId, // supported by your API slice
    status,
    search,
    date_from: dateFrom,
    date_to: dateTo,
  })
  const errText = getErrorMessage(error)
  const rows = data?.rows ?? []
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

  const renderStatusBadge = (status: OrderRow["status"]) => {
    const styles: Record<OrderRow["status"], string> = {
      Completed: "bg-[#EEFFF1] text-[#01B833]",
      "in-transit": "bg-[#F0EEF9] text-primary",
      Pending: "bg-[#FFF3ED] text-[#FF875C]",
      Cancelled: "bg-[#FFE1E1] text-[#F83B3B]",
    }
    const cls = styles[status] ?? "bg-gray-100 text-gray-600"
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${cls}`}>
        {status}
      </span>
    )
  }

  return (
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
                  Failed to load orders{errText ? `: ${errText}` : ""}
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
                      <span className="text-[10px] font-normal">{d.time}</span>
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
                  No orders found.
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
                  changePage((page ?? 1) - 1)
                }}
                disabled={(page ?? 1) <= 1}
              />
            </PaginationItem>

            {pages.map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  isActive={n === (page ?? 1)}
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(n)
                  }}
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
                  changePage((page ?? 1) + 1)
                }}
                disabled={(page ?? 1) >= (pages.at(-1) ?? 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default OrdersTable

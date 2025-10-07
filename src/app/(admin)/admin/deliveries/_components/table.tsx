"use client"

import { X } from "lucide-react"
import { useState } from "react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CancelledPackageInformation from "./cancelled"
import CompletedPackageInformation from "./completed"
import IntransitPackageInformation from "./inTransit"
import PendingPackageInformation from "./pending"

import {
  useUpdateDeliveryStatusMutation,
  type DeliveryRow,
} from "@/lib/redux/api/deliveries"
import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { DeliveryFilterValues } from "./filters"

/* ---------- props ---------- */
interface DeliveryTableProps {
  filters?: DeliveryFilterValues
  deliveries: DeliveryRow[]
  isLoading: boolean
  isError: boolean
  error?: FetchBaseQueryError | SerializedError
  page: number
  pages: number[]
  onPageChange: (p: number) => void
}

/* Map table row to dialog data */
function rowToDialog(r: DeliveryRow): DeliveryDialog {
  return {
    id: r.id,
    date: r.date,
    time: r.time,
    userName: r.user,
    deliveryType: "send",
    fee: r.fee,
    riderName: r.rider,
    pickupPoint: "-",
    destination: r.destination,
    duration: r.duration,
    status:
      r.status === "Completed"
        ? "completed"
        : r.status === "Cancelled"
        ? "cancelled"
        : r.status === "Pending"
        ? "pending"
        : "in-transit",
  }
}
/* ---------- mapping helpers ---------- */
const uiToApi: Record<
  DeliveryRow["status"],
  "pending" | "in_transit" | "completed" | "cancelled"
> = {
  Pending: "pending",
  "in-transit": "in_transit",
  Completed: "completed",
  Cancelled: "cancelled",
}

const STATUS_OPTIONS: {
  label: string
  value: "pending" | "in_transit" | "completed" | "cancelled"
}[] = [
  { label: "Pending", value: "pending" },
  { label: "In Transit", value: "in_transit" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
]

/* Tailwind classes for background + text colors (by API value) */
const statusColorClasses: Record<
  "pending" | "in_transit" | "completed" | "cancelled",
  { bg: string; text: string; ring: string; hover: string }
> = {
  pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    ring: "ring-amber-300",
    hover: "hover:bg-amber-100",
  },
  in_transit: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    ring: "ring-blue-300",
    hover: "hover:bg-blue-100",
  },
  completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    ring: "ring-emerald-300",
    hover: "hover:bg-emerald-100",
  },
  cancelled: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    ring: "ring-rose-300",
    hover: "hover:bg-rose-100",
  },
}

type DeliveryDialog = {
  id: number
  date: string
  time: string
  userName: string
  deliveryType: string
  fee: string
  riderName: string
  riderPhone?: string
  riderImage?: string
  pickupPoint: string
  destination: string
  duration: string
  status: "pending" | "in-transit" | "completed" | "cancelled"
  items?: {
    name: string
    price: string
    quantity: number
    selections?: string[]
  }[]
  trackingId?: string
  deliveryService?: { name: string; type: string; fee: string }
}
export function DeliveryTable({
  deliveries,
  isLoading,
  isError,
  error,
  page,
  pages,
  onPageChange,
}: DeliveryTableProps) {
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateDeliveryStatusMutation()

  // Track which rows are updating
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set())
  const setRowUpdating = (id: number, updating: boolean) =>
    setUpdatingIds((prev) => {
      const next = new Set(prev)
      if (updating) next.add(id)
      else next.delete(id)
      return next
    })

  // Dialog state
  const [selected, setSelected] = useState<DeliveryDialog | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRowClick = (row: DeliveryRow) => {
    if (isUpdating) return
    setSelected(rowToDialog(row))
    setDialogOpen(true)
  }
  const handleCloseDialog = () => setDialogOpen(false)

  const changePage = (p: number) => {
    const next = Math.max(1, Math.min(Math.max(1, pages.at(-1) ?? 1), p))
    onPageChange(next)
    document
      .querySelector(".rounded-md.border")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleStatusChange = async (
    row: DeliveryRow,
    nextApiValue: "pending" | "in_transit" | "completed" | "cancelled"
  ) => {
    if (updatingIds.has(row.id)) return
    setRowUpdating(row.id, true)
    try {
      await updateStatus({ id: row.id, status: nextApiValue }).unwrap()
      // Optimistic cache update handled in the slice; UI will reflect.
      // If the dialog is open for this row, reflect locally too:
      if (selected?.id === row.id) {
        const nextUi =
          nextApiValue === "completed"
            ? "completed"
            : nextApiValue === "cancelled"
            ? "cancelled"
            : nextApiValue === "pending"
            ? "pending"
            : "in-transit"
        setSelected({ ...selected, status: nextUi })
      }
    } finally {
      setRowUpdating(row.id, false)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-[44px] bg-[#EFEFEF] border-y border-[#F2F2F2]">
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Rider</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody aria-live="polite">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>Loading…</TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-red-600">
                    Failed to load deliveries
                    {(error as any)?.data?.message
                      ? `: ${(error as any).data.message}`
                      : ""}
                  </TableCell>
                </TableRow>
              ) : deliveries.length > 0 ? (
                deliveries.map((d) => {
                  const currentApi = uiToApi[d.status]
                  const color = statusColorClasses[currentApi]
                  const disabled = updatingIds.has(d.id) || isUpdating

                  return (
                    <TableRow
                      key={d.id}
                      onClick={() => handleRowClick(d)}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        disabled ? "opacity-70 pointer-events-none" : ""
                      }`}
                      title={disabled ? "Updating…" : undefined}
                    >
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
                      <TableCell className="max-w-[150px] whitespace-normal break-words">
                        {d.destination}
                      </TableCell>
                      <TableCell>{d.fee}</TableCell>
                      <TableCell>{d.duration}</TableCell>

                      {/* Status dropdown (stop click from opening dialog) */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={currentApi}
                          onValueChange={(v) =>
                            handleStatusChange(
                              d,
                              v as
                                | "pending"
                                | "in_transit"
                                | "completed"
                                | "cancelled"
                            )
                          }
                          disabled={disabled}
                        >
                          <SelectTrigger
                            className={[
                              "h-8 w-[150px] justify-between border-0",
                              "rounded-full px-3",
                              color.bg,
                              color.text,
                              color.hover,
                              "ring-0 focus:ring-2",
                              color.ring,
                            ].join(" ")}
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No deliveries match your filters.
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

      {/* Delivery Details Dialog */}
      {selected && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-white sm:max-w-[1080px] p-0 shadow-none border-0">
            <div className="relative flex flex-col gap-[36px] rounded-3xl py-[48px] px-20">
              <button
                type="button"
                className="absolute top-2 right-2 rounded-full bg-[#F83B3B] h-8 w-8 p-0 text-white"
                onClick={handleCloseDialog}
                disabled={isUpdating}
                title={isUpdating ? "Updating…" : "Close"}
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">Close</span>
              </button>

              {selected.status === "pending" ? (
                <PendingPackageInformation
                  deliveryId={selected.id}
                  handleMarkAsCompleted={async () => {
                    await updateStatus({
                      id: selected.id,
                      status: "completed" as any,
                    }).unwrap()
                    setSelected({ ...selected, status: "completed" })
                  }}
                  handleCancelDelivery={async () => {
                    await updateStatus({
                      id: selected.id,
                      status: "cancelled",
                    }).unwrap()
                    setSelected({ ...selected, status: "cancelled" })
                  }}
                />
              ) : selected.status === "in-transit" ? (
                <IntransitPackageInformation
                  deliveryId={selected.id}
                  handleMarkAsCompleted={async () => {
                    await updateStatus({
                      id: selected.id,
                      status: "completed" as any,
                    }).unwrap()
                    setSelected({ ...selected, status: "completed" })
                  }}
                  handleCancelDelivery={async () => {
                    await updateStatus({
                      id: selected.id,
                      status: "cancelled",
                    }).unwrap()
                    setSelected({ ...selected, status: "cancelled" })
                  }}
                />
              ) : selected.status === "completed" ? (
                <CompletedPackageInformation
                  deliveryId={selected.id}
                  handleMarkAsCompleted={() => {}}
                  handleCancelDelivery={async () => {
                    await updateStatus({
                      id: selected.id,
                      status: "cancelled",
                    }).unwrap()
                    setSelected({ ...selected, status: "cancelled" })
                  }}
                />
              ) : selected.status === "cancelled" ? (
                <CancelledPackageInformation
                  deliveryId={selected.id}
                  handleMarkAsCompleted={async () => {
                    await updateStatus({
                      id: selected.id,
                      status: "completed" as any,
                    }).unwrap()
                    setSelected({ ...selected, status: "completed" })
                  }}
                  handleCancelDelivery={() => {}}
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default DeliveryTable

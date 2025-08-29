"use client"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { DeliveryFilterValues } from "./filters"
import IntransitPackageInformation from "./inTransit"
import PendingPackageInformation from "./pending"
import CompletedPackageInformation from "./completed"
import CancelledPackageInformation from "./cancelled"

export interface Delivery {
  id: number
  date: string
  time: string
  userName: string
  packs: number
  fee: string
  riderName: string
  riderPhone?: string
  riderImage?: string
  pickupPoint: string
  destination: string
  duration: string
  status: string
  items?: {
    name: string
    img?: string
    price: string
    quantity: number
    selections?: string[]
  }[]
  orderId?: string
  deliveryService?: {
    name: string
    type: string
    fee: string
  }
}

interface DeliveryTableProps {
  filters?: DeliveryFilterValues
  deliveries?: Delivery[]
}

export function DeliveryTable({
  filters,
  deliveries = [],
}: DeliveryTableProps) {
  // -- state
  const [filtered, setFiltered] = useState(deliveries)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [totalPages, setTotalPages] = useState(1)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  )
  const [dialogOpen, setDialogOpen] = useState(false)

  // -- apply filters & recalc pagination
  useEffect(() => {
    let result = [...deliveries]

    if (filters) {
      const { location, status, searchQuery } = filters

      if (location !== "all-locations") {
        const locMap: Record<string, number[]> = {
          north: [1, 5, 9, 13, 17, 21, 25, 29],
          south: [2, 6, 10, 14, 18, 22, 26, 30],
          east: [3, 7, 11, 15, 19, 23, 27],
          west: [4, 8, 12, 16, 20, 24, 28],
        }
        result = result.filter((d) => locMap[location]?.includes(d.id))
      }

      if (status.length > 0) {
        result = result.filter((d) => status.includes(d.status))
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        result = result.filter(
          (d) =>
            d.userName.toLowerCase().includes(q) ||
            d.riderName.toLowerCase().includes(q) ||
            d.pickupPoint.toLowerCase().includes(q) ||
            d.destination.toLowerCase().includes(q)
        )
      }

      // dateRange logic here...
    }

    setFiltered(result)
    const pages = Math.max(1, Math.ceil(result.length / itemsPerPage))
    setTotalPages(pages)
    setCurrentPage((p) => Math.min(p, pages))
  }, [filters, deliveries, itemsPerPage])

  // -- slicing for current page
  const start = (currentPage - 1) * itemsPerPage
  const pageItems = filtered.slice(start, start + itemsPerPage)

  // -- handlers
  const changePage = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p))
    setCurrentPage(next)
    document
      .querySelector(".rounded-md.border")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleRowClick = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleMarkAsCompleted = () => {
    if (selectedDelivery) {
      const updatedDeliveries = filtered.map((d) =>
        d.id === selectedDelivery.id ? { ...d, status: "completed" } : d
      )
      setFiltered(updatedDeliveries)
      setSelectedDelivery({ ...selectedDelivery, status: "completed" })
    }
  }

  const handleCancelDelivery = () => {
    if (selectedDelivery) {
      const updatedDeliveries = filtered.map((d) =>
        d.id === selectedDelivery.id ? { ...d, status: "cancelled" } : d
      )
      setFiltered(updatedDeliveries)
      setSelectedDelivery({ ...selectedDelivery, status: "cancelled" })
    }
  }

  // -- page number array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-[44px] bg-[#EFEFEF] border-y border-[#F2F2F2]">
                <TableHead>Order Id</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Packs</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rider Name</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length > 0 ? (
                pageItems.map((d) => (
                  <TableRow
                    key={d.id}
                    onClick={() => handleRowClick(d)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>{d.orderId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col font-figtree font-semibold text-[12px]/[133%] -tracking-[2%]">
                        {d.date}

                        <span className="text-[10px]/[133%] font-normal">
                          {d.time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{d.packs}</TableCell>
                    <TableCell>{d.fee}</TableCell>
                    <TableCell>{d.riderName}</TableCell>
                    <TableCell className="max-w-[150px] whitespace-normal break-words">
                      {d.destination}
                    </TableCell>
                    <TableCell>{d.duration}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No deliveries match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent className="flex gap-2">
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Page numbers */}
              {pages.map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    isActive={n === currentPage}
                    onClick={() => changePage(n)}
                    size="icon"
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Delivery Details Dialog */}
      {selectedDelivery && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-white sm:max-w-[1080px] p-0 shadow-none border-0">
            <div className="relative flex flex-col gap-[36px] rounded-3xl py-[48px] px-20">
              {/* Close Button */}
              <div
                className="absolute top-2 right-2 rounded-full bg-[#F83B3B] h-8 w-8 p-0 text-white ring-0 z-10 shadow-none border-0 hover:bg-[#F83B3B] cursor-pointer flex justify-center items-center"
                onClick={handleCloseDialog}
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">Close</span>
              </div>

              {selectedDelivery.status === "pending" ? (
                <PendingPackageInformation
                  selectedDelivery={selectedDelivery}
                  handleMarkAsCompleted={handleMarkAsCompleted}
                  handleCancelDelivery={handleCancelDelivery}
                />
              ) : selectedDelivery.status === "in-transit" ? (
                <IntransitPackageInformation
                  selectedDelivery={selectedDelivery}
                  handleMarkAsCompleted={handleMarkAsCompleted}
                  handleCancelDelivery={handleCancelDelivery}
                />
              ) : selectedDelivery.status === "completed" ? (
                <CompletedPackageInformation
                  selectedDelivery={selectedDelivery}
                  handleMarkAsCompleted={handleMarkAsCompleted}
                  handleCancelDelivery={handleCancelDelivery}
                />
              ) : selectedDelivery.status === "cancelled" ? (
                <CancelledPackageInformation
                  selectedDelivery={selectedDelivery}
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

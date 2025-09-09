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
import { useState } from "react"

export type merchantFilterValues = {
  type: string
  status: string[]
  dateRange: string
  searchQuery: string
}

export interface Merchant {
  id: number
  date: string
  time: string
  user: string
  rider: string
  destination: string
  ends: string
  fee: string
  duration: string
  packs: number
  imgUrl: string
  category: string
  status: "in-transit" | "Pending" | "Completed" | "Cancelled"
}

// sample data...
const orders: Merchant[] = [
  {
    id: 1,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    user: "Tile Bar",
    destination: "114 Worm Avenue, Henlow, BD48 1IV",
    ends: "+2348012345610",
    fee: "₦ 264,786",
    rider: "Bilkis Illiyas",
    imgUrl: "/images/merchants/merchant-1.png",
    status: "Completed",
    duration: "2 months ago",
    packs: 3,
    category: "fashion",
  },
  {
    id: 2,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    user: "Metro Groceries",
    destination: "413 Horses Road, Smethwick, NG26 1BN",
    ends: "+2348012345611",
    fee: "₦ 264,786",
    rider: "Teekay Micheal",
    imgUrl: "/images/merchants/merchant-2.png",
    status: "Completed",
    duration: "3 weeks ago",
    packs: 2,
    category: "food",
  },
  {
    id: 3,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    user: "Fashion Hub",
    destination: "477 Elegant Avenue, North Berwick, SN49 7LU",
    ends: "+2348012345612",
    fee: "₦ 264,786",
    rider: "Moses Bonas",
    imgUrl: "/images/merchants/merchant-3.png",
    status: "Completed",
    duration: "1 month ago",
    packs: 6,
    category: "fashion",
  },
  {
    id: 4,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    user: "Tech World",
    destination: "229 Crash Lane, New Romney, DT65 6CT",
    ends: "+2348012345613",
    fee: "₦ 264,786",
    rider: "Musa Isa",
    imgUrl: "/images/merchants/merchant-4.png",
    status: "Cancelled",
    duration: "5 months ago",
    packs: 1,
    category: "it",
  },
  {
    id: 5,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    user: "Gourmet Delights",
    destination: "398 Improve Street, Tatsfield, TW15 7LS",
    ends: "+2348012345614",
    fee: "₦ 264,786",
    rider: "Mary John",
    imgUrl: "/images/merchants/merchant-5.png",
    status: "Completed",
    duration: "2 weeks ago",
    packs: 2,
    category: "supermarket",
  },
  {
    id: 6,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    user: "Pending Shop",
    destination: "108 Guitar Lane, Portsmouth, SM13 8LS",
    ends: "+2348012345615",
    fee: "₦ 0",
    rider: "John Doe",
    imgUrl: "/images/merchants/merchant-6.png",
    status: "Pending",
    duration: "3 days ago",
    packs: 1,
    category: "supermarket",
  },
  {
    id: 7,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    user: "Suspended Store",
    destination: "suspended@example.com",
    ends: "+2348012345616",
    fee: "₦ 264,786",
    rider: "Bilkis Illiyas",
    imgUrl: "/images/merchants/merchant-2.png",
    status: "Pending",
    duration: "4 months ago",
    packs: 1,
    category: "food",
  },
]

export function OrdersTable() {
  // -- state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage))

  // -- slicing for current page
  const start = (currentPage - 1) * itemsPerPage
  const pageItems = orders.slice(start, start + itemsPerPage)

  // -- handlers
  const changePage = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p))
    setCurrentPage(next)
    document
      .querySelector(".rounded-md.border")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  // -- page number array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    const statusStyles = {
      Completed: "bg-[#EEFFF1] text-[#01B833]",
      "in-transit": "bg-[#F0EEF9] text-primary",
      Pending: "bg-[#FFF3ED] text-[#FF875C]",
      Cancelled: "bg-[#FFE1E1] text-[#F83B3B]",
    }

    const style =
      statusStyles[status as keyof typeof statusStyles] ||
      "bg-gray-100 text-gray-600"

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${style}`}>
        {status}
      </span>
    )
  }

  return (
    <>
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
              {pageItems.length > 0 ? (
                pageItems.map((d) => (
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

                    <TableCell className="max-w-[150px] whitespace-normal break-words">
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
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(currentPage - 1)
                  }}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Page numbers */}
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

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    changePage(currentPage + 1)
                  }}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  )
}

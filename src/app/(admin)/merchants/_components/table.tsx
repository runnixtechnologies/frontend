"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { getInitials } from "@/lib/utils"
import { Ban, Eye, MoreVertical, Trash, UserPlus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Merchant } from "../page"
import type { MerchantFilterValues } from "./filters"

interface MerchantTableProps {
  filters?: MerchantFilterValues
  data?: Merchant[]
}

export function MerchantTable({ filters, data = [] }: MerchantTableProps) {
  // -- state
  const [filtered, setFiltered] = useState(data)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [totalPages, setTotalPages] = useState(1)

  // -- apply filters & recalc pagination
  useEffect(() => {
    let result = [...data]

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
            d.name.toLowerCase().includes(q) ||
            d.phone.toLowerCase().includes(q) ||
            d.email.toLowerCase().includes(q) ||
            d.creator.toLowerCase().includes(q)
        )
      }

      // dateRange logic here...
    }

    setFiltered(result)
    const pages = Math.max(1, Math.ceil(result.length / itemsPerPage))
    setTotalPages(pages)
    setCurrentPage((p) => Math.min(p, pages))
  }, [filters, data, itemsPerPage])

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

  // -- page number array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // -- action handlers
  const handleViewDetails = (merchant: Merchant) => {
    console.log("View details for:", merchant.name)
    // Implement view details logic
  }

  const handleSuspendUser = (merchant: Merchant) => {
    console.log("Edit merchant:", merchant.name)
    // Implement edit logic
  }

  const handleDelete = (merchant: Merchant) => {
    console.log("Delete merchant:", merchant.name)
    // Implement delete logic with confirmation
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#EFEFEF] py-3 px-6 border-0 border-t border-b border-[#F2F2F2]">
                <TableHead>Vendor Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length > 0 ? (
                pageItems.map((merchant) => (
                  <TableRow
                    key={merchant.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={merchant.imgUrl || "/placeholder.svg"}
                            alt="User"
                          />
                          <AvatarFallback>
                            {getInitials(merchant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-figtree font-normal text-[12px]/[133%] -tracking-[2%]">
                          {merchant.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{merchant.phone}</TableCell>
                    <TableCell>{merchant.creator}</TableCell>
                    <TableCell>{merchant.email}</TableCell>
                    <TableCell>{merchant.orders}</TableCell>
                    <TableCell>{merchant.earning}</TableCell>
                    <TableCell className="max-w-[150px] whitespace-normal break-words">
                      {merchant.rating}
                    </TableCell>
                    <TableCell>{merchant.joined}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 text-base font-medium transition-colors hover:bg-muted focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(merchant)}
                            className="cursor-pointer"
                          >
                            <Link
                              href={`/merchants/${merchant.id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          {merchant.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() => handleSuspendUser(merchant)}
                              className="cursor-pointer"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Suspend User</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleSuspendUser(merchant)}
                              className="cursor-pointer"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>Recall User</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(merchant)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No merchants match your filters.
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

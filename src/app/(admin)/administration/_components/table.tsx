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
import { Ban, Eye, MoreVertical, Trash, UserPlus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Admin } from "../page"
import type { AdminFilterValues } from "./filters"

interface AdminTableProps {
  filters?: AdminFilterValues
  data?: Admin[]
}

export function AdminTable({ filters, data = [] }: AdminTableProps) {
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
            d.email.toLowerCase().includes(q)
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
  const handleViewDetails = (admin: Admin) => {
    console.log("View details for:", admin.name)
    // Implement view details logic
  }

  const handleSuspendUser = (admin: Admin) => {
    console.log("Suspend admin:", admin.name)
    // Implement edit logic
  }

  const handleDelete = (admin: Admin) => {
    console.log("Delete admin:", admin.name)
    // Implement delete logic with confirmation
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#EFEFEF] py-3 px-6 border-0 border-t border-b border-[#F2F2F2]">
                <TableHead>Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length > 0 ? (
                pageItems.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={admin.imgUrl || "/placeholder.svg"}
                            alt="User"
                          />
                          <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <span className="font-figtree font-normal text-[12px]/[133%] -tracking-[2%]">
                          {admin.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.role}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 text-base font-medium transition-colors hover:bg-muted focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(admin)}
                            className="cursor-pointer"
                          >
                            <Link
                              href={`/administration/${admin.id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          {admin.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() => handleSuspendUser(admin)}
                              className="cursor-pointer"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Suspend User</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleSuspendUser(admin)}
                              className="cursor-pointer"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>Recall User</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(admin)}
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
                    No admins match your filters.
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

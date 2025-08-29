"use client"

import type React from "react"

import {
  AddShopIcon,
  CircledCheck,
  RemoveProfile,
  RemoveShopIcon,
  SuspendIcon,
  TickeIcon,
} from "@/components/svgs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useEffect, useState } from "react"
import { AdminFilters } from "./filter"

export type AdminFilterValues = {
  type: string
  location: string
  category: string
  status: string[]
  dateRange: string
  searchQuery: string
}

export interface Admin {
  id: number
  type: string
  action: string
  icon: React.ReactNode
  iconBg: string
  text: string
  highlight: string
  suffix: string
  time: string
}

const activityItems = [
  {
    id: 1,
    type: "Admin",
    action: "Deleted",
    icon: <RemoveProfile />,
    iconBg: "bg-[#FFE1E1] text-[#F83B3B]",
    text: "Deleted",
    highlight: "Carman Sham",
    suffix: "from Admins list",
    time: "2w ago",
  },
  {
    id: 2,
    action: "Resolved",
    type: "Issues",
    icon: <CircledCheck />,
    iconBg: "bg-[#EEFFF1] text-[#01B833]",
    text: "Resolved issue",
    highlight: "#50325588",
    suffix: "",
    time: "2w ago",
  },
  {
    id: 3,
    action: "Initiated",
    type: "Issues",
    icon: <TickeIcon />,
    iconBg: "bg-[#FFE2D4] text-[#FE6139]",
    text: "Initiated issue",
    highlight: "#50325588",
    suffix: "",
    time: "2w ago",
  },
  {
    id: 4,
    action: "Suspended",
    type: "Users",
    icon: <SuspendIcon />,
    iconBg: "bg-[#FFE1E1] text-[#F83B3B]",
    text: "Suspended",
    highlight: "Samuel Jackson",
    suffix: "from Users list",
    time: "2w ago",
  },
  {
    id: 5,
    action: "Approved",
    type: "Merchants",
    icon: <AddShopIcon />,
    iconBg: "bg-[#EEFFF1] text-[#01B833]",
    text: "Approved Merchant",
    highlight: "Chicken Nation",
    suffix: "",
    time: "2w ago",
  },
  {
    id: 6,
    action: "Resolved",
    type: "Issues",
    icon: <CircledCheck />,
    iconBg: "bg-[#EEFFF1] text-[]",
    text: "Resolved issue",
    highlight: "#50325588",
    suffix: "",
    time: "2w ago",
  },
  {
    id: 7,
    action: "Rejected",
    type: "Merchants",
    icon: <RemoveShopIcon />,
    iconBg: "bg-[#FFE1E1] text-[#F83B3B]",
    text: "Rejected Merchant",
    highlight: "Foodium",
    suffix: "",
    time: "2w ago",
  },
  {
    id: 8,
    action: "Initiated",
    type: "Issues",
    icon: <TickeIcon />,
    iconBg: "bg-[#FFE2D4] text-[#FE6139]",
    text: "Initiated issue",
    highlight: "#50325588",
    suffix: "",
    time: "2w ago",
  },
  {
    id: 9,
    action: "Resolved",
    type: "Issues",
    icon: <CircledCheck />,
    iconBg: "bg-[#EEFFF1] text-[]",
    text: "Resolved issue",
    highlight: "#50325588",
    suffix: "",
    time: "2w ago",
  },
  {
    id: 10,
    action: "Deleted",
    type: "Users",
    icon: <RemoveProfile />,
    iconBg: "bg-[#FFE1E1] text-[#F83B3B]",
    text: "Deleted",
    highlight: "Carman Sham",
    suffix: "from Users list",
    time: "2w ago",
  },
  {
    id: 11,
    action: "Initiated",
    type: "Issues",
    icon: <TickeIcon />,
    iconBg: "bg-[#FFE2D4] text-[#FE6139]",
    text: "Initiated issue",
    highlight: "#50325588",
    suffix: "",
    time: "2w ago",
  },
]
export function AdminDetailTable() {
  // -- state
  const [filtered, setFiltered] = useState<Admin[]>(activityItems)
  const [filters, setFilters] = useState<AdminFilterValues>({
    type: "all-type",
    location: "",
    category: "",
    status: [],
    dateRange: "",
    searchQuery: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

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

  // Merge new filter values
  const handleFilterChange = (newFilters: Partial<AdminFilterValues>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }
  useEffect(() => {
    let result = [...activityItems]

    // Category filter - filter by type if category is selected
    if (filters.category && filters.category !== "") {
      result = result.filter((d) => d.type === filters.category)
    }

    // Status filter - filter by action if status array is not empty
    if (filters.status && filters.status.length > 0) {
      result = result.filter((d) => filters.status.includes(d.action))
    }

    setFiltered(result)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [filters])

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-col items-center xl:flex-row gap-2 h-[96px] pt-6 pb-5 px-6 justify-between">
        <h2 className="text-[#191A1A] font-figtree font-bold text-[24px]/[32px] -tracking-[2%]">
          Activity logs
        </h2>
        <AdminFilters onFilterChange={handleFilterChange} />
      </div>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <div className="space-y-0">
            {pageItems?.map((item, index) => (
              <div key={item.id} className="relative">
                {/* Connecting line */}
                {index < pageItems?.length - 1 && (
                  <div className="absolute left-4 top-8 w-px h-8 bg-[#DCDCDC]"></div>
                )}

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${item.iconBg} relative z-10`}
                    >
                      {item.icon}
                    </div>
                    <div className="text-[#232323] font-figtree font-normal text-[16px]/[160%] -tracking-[2%]">
                      {item.text}{" "}
                      <span className="text-primary font-bold">
                        {item.highlight}
                      </span>
                      {item.suffix && (
                        <span className="font-bold"> {item.suffix}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-[#7C7C7C] font-medium font-figtree text-[12px]/[120%] tracking-normal">
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  )
}

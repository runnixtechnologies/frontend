"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { DashboardLayout } from "../_components/dashboard-layout"
import { SearchComponent } from "../_components/search-component"
import { AdminFilters, type AdminFilterValues } from "./_components/filters"
import { AdminTable } from "./_components/table"

export interface Admin {
  id: number
  name: string
  role: string
  imgUrl: string
  email: string
  status: "Active" | "Pending"
}
const adminData: Admin[] = [
  {
    id: 1,
    name: "Tile Bar",
    email: "tilebar@example.com",
    imgUrl: "/images/riders/rider-1.jpg",
    status: "Active",
    role: "Admin",
  },
  {
    id: 2,
    name: "Metro Groceries",
    email: "metro@example.com",
    role: "Member",
    imgUrl: "/images/riders/rider-2.jpg",
    status: "Active",
  },
  {
    id: 3,
    name: "Fashion Hub",
    email: "fashion@example.com",
    role: "Admin",
    imgUrl: "/images/riders/rider-3.jpg",
    status: "Active",
  },
  {
    id: 4,
    name: "Tech World",
    email: "fashion@example.com",
    imgUrl: "/images/riders/rider-4.jpg",
    status: "Active",
    role: "Member",
  },
  {
    id: 5,
    name: "Gourmet Delights",
    email: "gourmet@example.com",
    role: "Member",
    imgUrl: "/images/riders/rider-3.jpg",
    status: "Active",
  },
  {
    id: 6,
    name: "Pending Shop",
    email: "pending@example.com",
    role: "Admin",
    imgUrl: "/images/riders/rider-1.jpg",
    status: "Pending",
  },
  {
    id: 7,
    name: "Suspended Store",
    email: "suspended@example.com",
    role: "Member",
    imgUrl: "/images/riders/rider-4.jpg",
    status: "Pending",
  },
]

export default function AdminPage() {
  const [filtered, setFiltered] = useState<Admin[]>(adminData)
  const [filters, setFilters] = useState<AdminFilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    category: "",
    dateRange: "all-time",
    searchQuery: "",
  })

  useEffect(() => {
    let result = [...adminData]

    // 2) Location filter
    if (filters.location !== "all-locations") {
      const locMap: Record<string, number[]> = {
        north: [1, 5, 9, 13, 17, 21, 25, 29],
        south: [2, 6, 10, 14, 18, 22, 26, 30],
        east: [3, 7, 11, 15, 19, 23, 27],
        west: [4, 8, 12, 16, 20, 24, 28],
      }
      result = result.filter((d) => locMap[filters.location]?.includes(d.id))
    }

    // 4) Search
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q)
      )
    }

    setFiltered(result)
  }, [filters])

  // Handle search query change
  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query }
    setFilters(newFilters)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-lg border flex flex-col gap-3">
          <div className="w-full flex justify-between gap-2 pt-6 pb-5 px-6">
            <h3 className="font-figtree font-bold text-[24px]/[32px] text-[#313335] -tracking-[2%]">
              {adminData?.length} Members
            </h3>
            <div className="flex gap-2">
              <SearchComponent
                onSearch={handleSearchChange}
                placeholder="Search"
              />
              <AdminFilters />
              <Button className="">Invite new members</Button>
            </div>
          </div>

          <AdminTable filters={filters} data={filtered} />
        </div>
      </div>
    </DashboardLayout>
  )
}

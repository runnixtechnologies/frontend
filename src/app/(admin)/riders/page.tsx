"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "../_components/dashboard-layout"
import { RiderFilters, type RiderFilterValues } from "./_components/filters"
import { RiderStats } from "./_components/stats"
import { RiderTable } from "./_components/table"
import RiderTabs, { TabKey } from "./_components/tabs"

export interface Rider {
  id: number
  name: string
  type: string
  email: string
  phone: string
  earning: string
  gender: string
  joined: string
  trips: number
  imgUrl: string
  category: string
  status: "Active" | "Pending" | "Rejected" | "Suspended"
}

// sample data...
const ridersData: Rider[] = [
  {
    id: 1,
    name: "Tile Bar",
    email: "tilebar@example.com",
    phone: "+2348012345610",
    earning: "₦ 264,786",
    type: "Car",
    gender: "Male",
    imgUrl: "/images/riders/rider-1.jpg",
    status: "Active",
    joined: "12/4/2025",
    trips: 342,
    category: "fashion",
  },
  {
    id: 2,
    name: "Metro Groceries",
    email: "metro@example.com",
    phone: "+2348012345611",
    earning: "₦ 264,786",
    type: "Motorcycle",
    gender: "Female",
    imgUrl: "/images/riders/rider-2.jpg",
    status: "Active",
    joined: "12/5/2025",
    trips: 187,
    category: "food",
  },
  {
    id: 3,
    name: "Fashion Hub",
    email: "fashion@example.com",
    phone: "+2348012345612",
    earning: "₦ 264,786",
    type: "Motorcycle",
    gender: "Male",
    imgUrl: "/images/riders/rider-3.jpg",
    status: "Active",
    joined: "12/6/2025",
    trips: 256,
    category: "fashion",
  },
  {
    id: 4,
    name: "Tech World",
    email: "tech@example.com",
    phone: "+2348012345613",
    earning: "₦ 264,786",
    type: "Car",
    gender: "Male",
    imgUrl: "/images/riders/rider-4.jpg",
    status: "Active",
    joined: "12/7/2025",
    trips: 421,
    category: "it",
  },
  {
    id: 5,
    name: "Gourmet Delights",
    email: "gourmet@example.com",
    phone: "+2348012345614",
    earning: "₦ 264,786",
    type: "Motorcycle",
    gender: "Male",
    imgUrl: "/images/riders/rider-3.jpg",
    status: "Active",
    joined: "12/8/2025",
    trips: 98,
    category: "supermarket",
  },
  {
    id: 6,
    name: "Pending Shop",
    email: "pending@example.com",
    phone: "+2348012345615",
    earning: "₦ 0",
    type: "Card",
    gender: "Female",
    imgUrl: "/images/riders/rider-1.jpg",
    status: "Pending",
    joined: "12/9/2025",
    trips: 0,
    category: "supermarket",
  },
  {
    id: 7,
    name: "Suspended Store",
    email: "suspended@example.com",
    phone: "+2348012345616",
    earning: "₦ 264,786",
    type: "Car",
    gender: "Male",
    imgUrl: "/images/riders/rider-4.jpg",
    status: "Suspended",
    joined: "12/12/2025",
    trips: 156,
    category: "food",
  },
]

export default function RidersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [filtered, setFiltered] = useState<Rider[]>(ridersData)
  const [filters, setFilters] = useState<RiderFilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    category: "",
    dateRange: "all-time",
    searchQuery: "",
  })

  // Pre-calc counts for display in the tabs
  const tabCounts = useMemo<Record<TabKey, number>>(
    () => ({
      all: ridersData.length,
      active: ridersData.filter((d) => d.status === "Active").length,
      pending: ridersData.filter((d) => d.status === "Pending").length,
      suspended: ridersData.filter((d) => d.status === "Suspended").length,
      rejected: ridersData.filter((d) => d.status === "Rejected").length,
    }),
    []
  )

  // Recompute filtered list whenever activeTab or other filters change
  useEffect(() => {
    let result = [...ridersData]

    // 1) Tab‐driven status filter
    if (activeTab !== "all") {
      const statusLabel = (activeTab.charAt(0).toUpperCase() +
        activeTab.slice(1)) as Rider["status"]
      result = result.filter((d) => d.status === statusLabel)
    }

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

    // 3) Category dropdown
    if (filters.category) {
      result = result.filter((d) => d.category === filters.category)
    }

    // 4) Search
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q)
      )
    }

    setFiltered(result)
  }, [activeTab, filters])

  // Merge new filter values
  const handleFilterChange = (newFilters: Partial<RiderFilterValues>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <RiderStats />

        <div className="w-full bg-white rounded-lg border flex flex-col gap-3">
          <div className="w-full flex justify-between gap-2 pt-6 pb-5 px-6">
            <RiderTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              size={filtered.length}
              tabCounts={tabCounts}
            />
            <RiderFilters onFilterChange={handleFilterChange} />
          </div>

          <RiderTable filters={filters} data={filtered} />
        </div>
      </div>
    </DashboardLayout>
  )
}

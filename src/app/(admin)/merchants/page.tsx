"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "../_components/dashboard-layout"
import {
  MerchantFilters,
  type MerchantFilterValues,
} from "./_components/filters"
import { MerchantStats } from "./_components/stats"
import { MerchantTable } from "./_components/table"
import MerchantTabs, { TabKey } from "./_components/tabs"

export interface Merchant {
  id: number
  name: string
  creator: string
  email: string
  phone: string
  earning: string
  rating: number
  joined: string
  orders: number
  imgUrl: string
  category: string
  status: "Active" | "Pending" | "Rejected" | "Suspended"
}

// sample data...
const merchantsData: Merchant[] = [
  {
    id: 1,
    name: "Tile Bar",
    email: "tilebar@example.com",
    phone: "+2348012345610",
    earning: "₦ 264,786",
    creator: "Bilkis Illiyas",
    rating: 4.5,
    imgUrl: "/images/merchants/merchant-1.png",
    status: "Active",
    joined: "2 months ago",
    orders: 342,
    category: "fashion",
  },
  {
    id: 2,
    name: "Metro Groceries",
    email: "metro@example.com",
    phone: "+2348012345611",
    earning: "₦ 264,786",
    creator: "Teekay Micheal",
    rating: 4.5,
    imgUrl: "/images/merchants/merchant-2.png",
    status: "Active",
    joined: "3 weeks ago",
    orders: 187,
    category: "food",
  },
  {
    id: 3,
    name: "Fashion Hub",
    email: "fashion@example.com",
    phone: "+2348012345612",
    earning: "₦ 264,786",
    creator: "Moses Bonas",
    rating: 4.5,
    imgUrl: "/images/merchants/merchant-3.png",
    status: "Active",
    joined: "1 month ago",
    orders: 256,
    category: "fashion",
  },
  {
    id: 4,
    name: "Tech World",
    email: "tech@example.com",
    phone: "+2348012345613",
    earning: "₦ 264,786",
    creator: "Musa Isa",
    rating: 4.5,
    imgUrl: "/images/merchants/merchant-4.png",
    status: "Active",
    joined: "5 months ago",
    orders: 421,
    category: "it",
  },
  {
    id: 5,
    name: "Gourmet Delights",
    email: "gourmet@example.com",
    phone: "+2348012345614",
    earning: "₦ 264,786",
    creator: "Mary John",
    rating: 4.5,
    imgUrl: "/images/merchants/merchant-5.png",
    status: "Active",
    joined: "2 weeks ago",
    orders: 98,
    category: "supermarket",
  },
  {
    id: 6,
    name: "Pending Shop",
    email: "pending@example.com",
    phone: "+2348012345615",
    earning: "₦ 0",
    creator: "John Doe",
    rating: 4,
    imgUrl: "/images/merchants/merchant-6.png",
    status: "Pending",
    joined: "3 days ago",
    orders: 0,
    category: "supermarket",
  },
  {
    id: 7,
    name: "Suspended Store",
    email: "suspended@example.com",
    phone: "+2348012345616",
    earning: "₦ 264,786",
    creator: "Bilkis Illiyas",
    rating: 4.5,
    imgUrl: "/images/merchants/merchant-2.png",
    status: "Suspended",
    joined: "4 months ago",
    orders: 156,
    category: "food",
  },
]

export default function MerchantsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [filtered, setFiltered] = useState<Merchant[]>(merchantsData)
  const [filters, setFilters] = useState<MerchantFilterValues>({
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
      all: merchantsData.length,
      active: merchantsData.filter((d) => d.status === "Active").length,
      pending: merchantsData.filter((d) => d.status === "Pending").length,
      suspended: merchantsData.filter((d) => d.status === "Suspended").length,
      rejected: merchantsData.filter((d) => d.status === "Rejected").length,
    }),
    []
  )

  // Recompute filtered list whenever activeTab or other filters change
  useEffect(() => {
    let result = [...merchantsData]

    // 1) Tab‐driven status filter
    if (activeTab !== "all") {
      const statusLabel = (activeTab.charAt(0).toUpperCase() +
        activeTab.slice(1)) as Merchant["status"]
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
          d.creator.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q)
      )
    }

    setFiltered(result)
  }, [activeTab, filters])

  // Merge new filter values
  const handleFilterChange = (newFilters: Partial<MerchantFilterValues>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <MerchantStats />

        <div className="w-full bg-white rounded-lg border flex flex-col gap-3">
          <div className="w-full flex justify-between gap-2 pt-6 pb-5 px-6">
            <MerchantTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              size={filtered.length}
              tabCounts={tabCounts}
            />
            <MerchantFilters onFilterChange={handleFilterChange} />
          </div>

          <MerchantTable filters={filters} data={filtered} />
        </div>
      </div>
    </DashboardLayout>
  )
}

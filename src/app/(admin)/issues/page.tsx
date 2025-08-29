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
  date: string
  time: string
  sender: string
  type: string
  category: string
  message: string
  orderId: string
  imgUrl: string
  status: "Pending" | "InProgress" | "Resolved"
}

// sample data...
const issuesData: Merchant[] = [
  {
    id: 1,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    name: "Tile Bar",
    category: "Deliveries / Order",
    message: `Risus adipiscing euismod viverra sem pretium. Hac sit lobortis mi sed vitae at quam. Ut donec tincidunt habitant aliquet scelerisque lorem tellus.`,
    sender: "Bilkis Illiyas",
    orderId: "64ff34dd",
    imgUrl: "/images/merchants/merchant-1.png",
    status: "Resolved",
    type: "User",
  },
  {
    id: 2,
    name: "Metro Groceries",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    category: "Deliveries / Order",
    message: ` Risus adipiscing euismod viverra sem pretium. Hac sit lobortis mi sed vitae at quam. Ut donec tincidunt habitant aliquet scelerisque lorem tellus.`,
    sender: "Teekay Micheal",
    orderId: "64ff34dd",
    imgUrl: "/images/merchants/merchant-2.png",
    status: "Resolved",
    type: "Merchant",
  },
  {
    id: 3,
    name: "user Hub",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    category: "Patrtnership/Business",
    message: ` Risus adipiscing euismod viverra sem pretium. Hac sit lobortis mi sed vitae at quam. Ut donec tincidunt habitant aliquet scelerisque lorem tellus.`,
    sender: "Moses Bonas",
    orderId: "64ff34dd",
    imgUrl: "/images/merchants/merchant-3.png",
    status: "Resolved",
    type: "User",
  },
  {
    id: 4,
    name: "Tech World",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    category: "Deliveries / Order",
    message: ` Risus adipiscing euismod viverra sem pretium. Hac sit lobortis mi sed vitae at quam. Ut donec tincidunt habitant aliquet scelerisque lorem tellus.`,
    sender: "Musa Isa",
    orderId: "64ff34dd",
    imgUrl: "/images/merchants/merchant-4.png",
    status: "Resolved",
    type: "Merchant",
  },
  {
    id: 5,
    name: "Gourmet Delights",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    category: "General Enquiries",
    message: `Risus adipiscing euismod viverra sem pretium. Hac sit lobortis mi sed vitae at quam. Ut donec tincidunt habitant aliquet scelerisque lorem tellus.`,
    sender: "Mary John",
    orderId: "64ff34dd",
    imgUrl: "/images/merchants/merchant-5.png",
    status: "Resolved",
    type: "Rider",
  },
  {
    id: 6,
    name: "Pending Shop",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    category: "Operations",
    message: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, natus!`,
    sender: "John Doe",
    orderId: "123ff34dd",
    imgUrl: "/images/merchants/merchant-6.png",
    status: "Pending",
    type: "Rider",
  },
  {
    id: 7,
    name: "Suspended Store",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    category: "General Enquiries",
    message: ` Risus adipiscing euismod viverra sem pretium. Hac sit lobortis mi sed vitae at quam. Ut donec tincidunt habitant aliquet scelerisque lorem tellus.`,
    sender: "Bilkis Illiyas",
    orderId: "64ff34dd",
    imgUrl: "/images/merchants/merchant-2.png",
    status: "InProgress",
    type: "Merchant",
  },
]

export default function MerchantsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [filtered, setFiltered] = useState<Merchant[]>(issuesData)
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
      all: issuesData.length,
      resolved: issuesData.filter((d) => d.status === "Resolved").length,
      pending: issuesData.filter((d) => d.status === "Pending").length,
      "in-progress": issuesData.filter((d) => d.status === "InProgress").length,
    }),
    []
  )

  // Recompute filtered list whenever activeTab or other filters change
  useEffect(() => {
    let result = [...issuesData]

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
          d.type.toLowerCase().includes(q) ||
          d.sender.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
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

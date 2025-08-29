"use client"

import { useState } from "react"
import Foods from "./food"
import Packages from "./packages"
import Sides from "./sides"
import ProductTabs, { type TabKey } from "./tab"
import { ProductSearch } from "./search"

export type FilterValues = {
  type: string
  location: string
  status: string[]
  dateRange: string
  searchQuery: string
}

export default function Products() {
  const [activeTab, setActiveTab] = useState<TabKey>("foods")
  const [filters, setFilters] = useState<FilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    dateRange: "all-time",
    searchQuery: "",
  })
  // Handle search query change
  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query }
    setFilters(newFilters)
  }

  return (
    <div className="flex flex-col gap-8">
      <ProductSearch onSearch={handleSearchChange} placeholder="Search" />
      <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full">
        {activeTab === "foods" && <Foods />}
        {activeTab === "sides" && <Sides />}
        {activeTab === "packages" && <Packages />}
      </div>
    </div>
  )
}

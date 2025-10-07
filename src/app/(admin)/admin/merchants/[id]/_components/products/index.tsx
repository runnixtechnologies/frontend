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

type ProductsProps = {
  merchantUserId: number | string
  currentStoreId: number | string
}

export default function Products({
  merchantUserId,
  currentStoreId,
}: ProductsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("foods")
  const [filters, setFilters] = useState<FilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    dateRange: "all-time",
    searchQuery: "",
  })

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }))
  }

  return (
    <div className="flex flex-col gap-8">
      <ProductSearch
        onSearch={handleSearchChange}
        placeholder="Search products..."
      />
      <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full">
        {activeTab === "foods" && (
          <Foods
            merchantUserId={merchantUserId}
            currentStoreId={currentStoreId}
            searchQuery={filters.searchQuery}
          />
        )}
        {activeTab === "sides" && (
          <Sides
            merchantUserId={merchantUserId}
            currentStoreId={currentStoreId}
            searchQuery={filters.searchQuery}
          />
        )}
        {activeTab === "packages" && (
          <Packages
            merchantUserId={merchantUserId}
            currentStoreId={currentStoreId}
            searchQuery={filters.searchQuery}
          />
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import BikeImage from "./bikeImage"
import VehicleInformation from "./form"
import ProductTabs, { type TabKey } from "./tab"

export type FilterValues = {
  type: string
  location: string
  status: string[]
  dateRange: string
  searchQuery: string
}

export default function Products() {
  const [activeTab, setActiveTab] = useState<TabKey>("form")

  return (
    <div className="flex gap-[48px]">
      <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full">
        {activeTab === "form" && <VehicleInformation />}
        {activeTab === "image" && <BikeImage />}
      </div>
    </div>
  )
}

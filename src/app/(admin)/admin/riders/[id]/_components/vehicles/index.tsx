"use client"

import { useState } from "react"
import VehicleInformation from "./form"
import VehicleExterior from "./photos"
import ProductTabs, { type TabKey } from "./tab"

type ProductsProps = { userId: number }

export default function Products({ userId }: ProductsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("form")

  return (
    <div className="flex gap-[48px]">
      <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full">
        {activeTab === "form" && <VehicleInformation userId={userId} />}
        {activeTab === "image" && <VehicleExterior userId={userId} />}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { DashboardLayout } from "../_components/dashboard-layout"
import { Category } from "./_components/category"
import NewCategory from "./_components/category/new"
import { initialCategoryData } from "./_components/constants"
import { DeliveryTabs } from "./_components/tabs"

export interface Delivery {
  id: number
  date: string
  time: string
  userName: string
  deliveryType: string
  fee: string
  riderName: string
  riderPhone?: string
  riderImage?: string
  pickupPoint: string
  destination: string
  duration: string
  status: string
  items?: {
    name: string
    img?: string
    price: string
    quantity: number
    selections?: string[]
  }[]
  trackingId?: string
  deliveryService?: {
    name: string
    type: string
    fee: string
  }
}

export default function DeliveriesPage() {
  const [activeTab, setActiveTab] = useState("supermarket")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white  rounded-lg border flex flex-col gap-3 ">
          <div className="w-full xl:h-[77px] flex justify-between items-center gap-2 pt-6 pb-5 px-6 border-b border-[#EFEFEF]">
            <DeliveryTabs
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
            {/* <Button className="cursor-pointer">
              <PlusCircle /> Create Category
            </Button> */}
            <NewCategory />
          </div>
          {activeTab === "supermarket" ? (
            <Category data={initialCategoryData?.supermarket} />
          ) : activeTab === "it" ? (
            <Category data={initialCategoryData?.it} />
          ) : activeTab === "fashion" ? (
            <Category data={initialCategoryData?.fashion} />
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  )
}

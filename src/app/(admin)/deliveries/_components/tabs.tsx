"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DeliveryTabsProps {
  activeTab: string
  setActiveTab: (value: string) => void
  size: number
  tabCounts?: {
    all: number
    "in-transit": number
    pending: number
    completed: number
    cancelled: number
  }
}

export function DeliveryTabs({
  activeTab,
  setActiveTab,
  size,
  tabCounts,
}: DeliveryTabsProps) {
  const values = [
    {
      id: "in-transit",
      label: "In Transit",
      total: tabCounts ? tabCounts["in-transit"] : size,
    },
    {
      id: "pending",
      label: "Pending",
      total: tabCounts ? tabCounts["pending"] : size,
    },
    {
      id: "completed",
      label: "Completed",
      total: tabCounts ? tabCounts["completed"] : size,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      total: tabCounts ? tabCounts["cancelled"] : size,
    },
  ]
  return (
    <div className="w-full xl:w-[537.6px] border-b px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
          {values?.map((value) => (
            <TabsTrigger
              key={value.id}
              value={value.id}
              className="relative h-[33px] rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-[#636066] data-[state=active]:font-bold font-normal font-figtree text-sm/[120%] shadow-none -tracking-[2%] cursor-pointer"
            >
              {`${value.label} ${value.total > 0 ? `(${value.total})` : ""}`}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

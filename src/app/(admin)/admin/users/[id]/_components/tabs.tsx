"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TabKey = "orders" | "transaction"

export interface RiderTabsProps {
  activeTab: TabKey
  setActiveTab: (tab: TabKey) => void
  tabCounts?: Record<TabKey, number>
}

export default function RiderDetailTabs({
  activeTab,
  setActiveTab,
}: RiderTabsProps) {
  const values: { id: TabKey; label: string }[] = [
    { id: "orders", label: "Orders" },
    {
      id: "transaction",
      label: "Transactions",
    },
  ]

  return (
    <div className="w-full xl:w-[537.6px] border-b px-0">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value as TabKey)}
        className="w-full"
      >
        <TabsList className="w-fit justify-start rounded-none border-b-0 bg-transparent p-0">
          {values.map(({ id, label }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="relative h-[33px] rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparentd data-[state=active]:shadow-none data-[state=active]:text-primary text-[#636066] data-[state=active]:font-bold font-normal font-figtree text-sm/[120%] shadow-none -tracking-[2%] cursor-pointer"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

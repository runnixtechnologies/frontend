"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TabKey = "foods" | "sides" | "packages"

export interface MerchantTabsProps {
  activeTab: TabKey
  setActiveTab: (tab: TabKey) => void
  tabCounts?: Record<TabKey, number>
}

export default function ProductTabs({
  activeTab,
  setActiveTab,
}: MerchantTabsProps) {
  const values: { id: TabKey; label: string }[] = [
    { id: "foods", label: "Foods" },
    { id: "sides", label: "Sides" },
    { id: "packages", label: "Packages" },
  ]

  return (
    <div className="w-full xl:w-[537.6px] border-b">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value as TabKey)}
        className="w-full px-0"
      >
        <TabsList className="w-fit justify-start rounded-none border-b-0 bg-transparent py-0 first:px-0 gap-4 shadow-none">
          {values.map(({ id, label }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="w-fit relative h-[33px] rounded-none border-0 border-b-2 border-transparent px-1 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[#636066] data-[state=active]:font-bold font-normal font-figtree text-sm/[120%] shadow-none -tracking-[2%] cursor-pointer"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

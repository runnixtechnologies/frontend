"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TabKey = "form" | "image"

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
    { id: "form", label: "Vehicle Information" },
    { id: "image", label: "Vehicle Images" },
  ]

  return (
    <div className="w-full xl:w-[300px] border-r border-[#EFEFEF]">
      <div className="w-full xl:w-[200px]">
        <Tabs
          value={activeTab}
          onValueChange={(value: string) => setActiveTab(value as TabKey)}
          className="h-full py-0"
          orientation="vertical"
        >
          <TabsList className="w-fit  flex-col justify-start rounded-none border-b-0 bg-transparent py-0 first:px-0 gap-4 shadow-none">
            {values.map(({ id, label }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="w-[169px] justify-start relative h-[40px] rounded-none border-0 border-b-2 border-transparent py-2 px-3 data-[state=active]:border-0 data-[state=active]:bg-[#F7F6FC] data-[state=active]:text-primary data-[state=active]:shadow-none text-[#636066] data-[state=active]:font-bold font-normal font-figtree text-sm/[120%] shadow-none -tracking-[2%] cursor-pointer"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

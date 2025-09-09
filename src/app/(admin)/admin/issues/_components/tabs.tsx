"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TabKey = "all" | "pending" | "in-progress" | "resolved"

export interface MerchantTabsProps {
  activeTab: TabKey
  setActiveTab: (tab: TabKey) => void
  size: number
  tabCounts?: Record<TabKey, number>
}

export default function MerchantTabs({
  activeTab,
  setActiveTab,
  size,
  tabCounts,
}: MerchantTabsProps) {
  const values: { id: TabKey; label: string; total: number }[] = [
    { id: "all", label: "All Issues", total: tabCounts?.all ?? size },
    {
      id: "pending",
      label: "Pending Issues",
      total: tabCounts?.pending ?? size,
    },
    {
      id: "in-progress",
      label: "In Progress",
      total: tabCounts?.["in-progress"] ?? size,
    },
    { id: "resolved", label: "Resolved", total: tabCounts?.resolved ?? size },
  ]

  return (
    <div className="w-full xl:w-[537.6px] border-b px-4">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value as TabKey)}
        className="w-full"
      >
        <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
          {values.map(({ id, label, total }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="relative h-[33px] rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-[#636066] data-[state=active]:font-bold font-normal font-figtree text-sm/[120%] shadow-none -tracking-[2%] cursor-pointer"
            >
              {label}
              {total > 0 && ` (${total})`}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

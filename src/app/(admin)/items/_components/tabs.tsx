"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DeliveryTabsProps {
  activeTab: string
  setActiveTab: (value: string) => void
}

export function DeliveryTabs({ activeTab, setActiveTab }: DeliveryTabsProps) {
  const values = [
    {
      id: "supermarket",
      label: "Supermarket",
    },
    {
      id: "it",
      label: "IT & Gadgets",
    },
    {
      id: "fashion",
      label: "Fashion & Lifestyle",
    },
  ]
  return (
    <div className="border-b px-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-fit justify-start rounded-none border-b-0 bg-transparent p-0">
          {values?.map((value) => (
            <TabsTrigger
              key={value.id}
              value={value.id}
              className="relative h-[33px] rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-[#636066] data-[state=active]:font-bold font-normal font-figtree text-sm/[120%] shadow-none -tracking-[2%] cursor-pointer"
            >
              {value.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

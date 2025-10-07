"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as React from "react"

type DeliveryTab = "all" | "in-transit" | "pending" | "completed" | "cancelled"

interface DeliveryTabsProps {
  activeTab: DeliveryTab
  setActiveTab: (value: DeliveryTab) => void
  /** Total count across all statuses (from server). */
  size: number
  /** Optional per-status page counts; falls back to size/all gracefully. */
  tabCounts?: {
    all: number
    "in-transit": number
    pending: number
    completed: number
    cancelled: number
  }
  /** Show the “All” tab. Defaults to true. */
  showAll?: boolean
  /** Compact style (smaller paddings). Defaults to false. */
  compact?: boolean
}

const nf = new Intl.NumberFormat("en-NG")

export function DeliveryTabs({
  activeTab,
  setActiveTab,
  size,
  tabCounts,
  showAll = true,
  compact = false,
}: DeliveryTabsProps) {
  const items: Array<{ id: DeliveryTab; label: string; total: number }> = [
    ...(showAll
      ? [
          {
            id: "all" as const,
            label: "All",
            total: tabCounts?.all ?? size ?? 0,
          },
        ]
      : []),
    {
      id: "in-transit",
      label: "In Transit",
      total: tabCounts?.["in-transit"] ?? 0,
    },
    { id: "pending", label: "Pending", total: tabCounts?.pending ?? 0 },
    { id: "completed", label: "Completed", total: tabCounts?.completed ?? 0 },
    { id: "cancelled", label: "Cancelled", total: tabCounts?.cancelled ?? 0 },
  ]

  return (
    <div className="w-full xl:w-[537.6px] border-b px-4">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as DeliveryTab)}
        className="w-full"
      >
        {/* make list horizontally scrollable on small screens to avoid wrapping */}
        <TabsList
          className={[
            "w-full justify-start rounded-none border-b-0 bg-transparent p-0",
            "overflow-x-auto scrollbar-none",
            "min-w-0",
          ].join(" ")}
          aria-label="Filter deliveries by status"
        >
          <div className="flex gap-1 sm:gap-2">
            {items.map(({ id, label, total }) => (
              <TabsTrigger
                key={id}
                value={id}
                className={[
                  "relative rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary",
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "text-[#636066] data-[state=active]:text-primary data-[state=active]:font-bold font-figtree",
                  "shadow-none -tracking-[2%] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  compact
                    ? "h-8 px-3 text-[13px]/[120%]"
                    : "h-[33px] px-4 py-3 text-sm/[120%]",
                ].join(" ")}
              >
                <span className="mr-2">{label}</span>
                <span
                  className={[
                    "inline-flex items-center justify-center rounded-full",
                    "text-[11px] leading-none px-2 py-1",
                    id === activeTab
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground/70",
                  ].join(" ")}
                  aria-label={`${label} count`}
                >
                  {nf.format(total)}
                </span>
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      </Tabs>
    </div>
  )
}

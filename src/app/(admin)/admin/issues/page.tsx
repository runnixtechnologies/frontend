// src/app/(admin)/admin/issues/page.tsx
"use client"

import { useGetIssuesQuery } from "@/lib/redux/api/issues"
import { useEffect, useMemo, useState } from "react"
import { IssueFilters, type IssueFilterValues } from "./_components/filters"
import { IssuesTable } from "./_components/table"
import IssueTabs, { TabKey } from "./_components/tabs"

export interface IssuesProps {
  id: number
  name: string
  date: string
  time: string
  sender: string
  type: string
  category: string
  message: string
  orderId: string
  imgUrl: string
  status: "Pending" | "InProgress" | "Resolved"
  assigned_role_id?: number | null
}

/** seed/demo data (used as visual fallback while first load occurs) */
const seed: IssuesProps[] = [
  {
    id: 1,
    name: "Tile Bar",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    sender: "Bilkis Illiyas",
    type: "User",
    category: "Deliveries / Order",
    message: "Lorem…",
    orderId: "64ff34dd",
    imgUrl: "/images/Issues/Issue-1.png",
    status: "Resolved",
  },
  {
    id: 2,
    name: "Metro Groceries",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    sender: "Teekay Micheal",
    type: "Issue",
    category: "Deliveries / Order",
    message: "Lorem…",
    orderId: "64ff34dd",
    imgUrl: "/images/Issues/Issue-2.png",
    status: "Resolved",
  },
  {
    id: 3,
    name: "User Hub",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    sender: "Moses Bonas",
    type: "User",
    category: "Partnership/Business",
    message: "Lorem…",
    orderId: "64ff34dd",
    imgUrl: "/images/Issues/Issue-3.png",
    status: "Resolved",
  },
  {
    id: 4,
    name: "Tech World",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    sender: "Musa Isa",
    type: "Issue",
    category: "Deliveries / Order",
    message: "Lorem…",
    orderId: "64ff34dd",
    imgUrl: "/images/Issues/Issue-4.png",
    status: "Resolved",
  },
  {
    id: 5,
    name: "Gourmet Delights",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    sender: "Mary John",
    type: "Rider",
    category: "General Enquiries",
    message: "Lorem…",
    orderId: "64ff34dd",
    imgUrl: "/images/Issues/Issue-5.png",
    status: "Resolved",
  },
  {
    id: 6,
    name: "Pending Shop",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    sender: "John Doe",
    type: "Rider",
    category: "Operations",
    message: "Lorem…",
    orderId: "123ff34dd",
    imgUrl: "/images/Issues/Issue-6.png",
    status: "Pending",
  },
  {
    id: 7,
    name: "Suspended Store",
    date: "Sat 15, Aug",
    time: "4:30 PM",
    sender: "Bilkis Illiyas",
    type: "Issue",
    category: "General Enquiries",
    message: "Lorem…",
    orderId: "64ff34dd",
    imgUrl: "/images/Issues/Issue-2.png",
    status: "InProgress",
  },
]

export default function IssuesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [rows, setRows] = useState<IssuesProps[]>(seed)
  const [filtered, setFiltered] = useState<IssuesProps[]>(rows)
  const [filters, setFilters] = useState<IssueFilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    category: "",
    dateRange: "all-time",
    searchQuery: "",
  })

  // Fetch issues from backend (adjust params if needed)
  const { data: issuesResp, isFetching } = useGetIssuesQuery({
    page: 1,
    per_page: 100,
  })

  // Use backend rows when available
  useEffect(() => {
    if (issuesResp?.rows && issuesResp.rows.length >= 0) {
      // issuesResp.rows is already normalized in the API slice (Issue shape)
      setRows(issuesResp.rows as unknown as IssuesProps[])
    }
  }, [issuesResp])

  // Tab counts reflect the current "rows"
  const tabCounts = useMemo<Record<TabKey, number>>(
    () => ({
      all: rows.length,
      resolved: rows.filter((d) => d.status === "Resolved").length,
      pending: rows.filter((d) => d.status === "Pending").length,
      "in-progress": rows.filter((d) => d.status === "InProgress").length,
    }),
    [rows]
  )

  // Filtering pipeline
  useEffect(() => {
    let result = [...rows]

    if (activeTab !== "all") {
      const statusLabel = (activeTab.charAt(0).toUpperCase() +
        activeTab.slice(1)) as IssuesProps["status"]
      result = result.filter((d) => d.status === statusLabel)
    }

    if (filters.location !== "all-locations") {
      const locMap: Record<string, number[]> = {
        north: [1, 5, 9, 13, 17, 21, 25, 29],
        south: [2, 6, 10, 14, 18, 22, 26, 30],
        east: [3, 7, 11, 15, 19, 23, 27],
        west: [4, 8, 12, 16, 20, 24, 28],
      }
      result = result.filter((d) => locMap[filters.location]?.includes(d.id))
    }

    if (filters.category) {
      result = result.filter((d) => d.category === filters.category)
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.sender.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      )
    }

    if (filters.status.length > 0) {
      result = result.filter((d) => filters.status.includes(d.status))
    }

    setFiltered(result)
  }, [activeTab, filters, rows])

  const handleFilterChange = (next: Partial<IssueFilterValues>) => {
    setFilters((prev) => ({ ...prev, ...next }))
  }
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="w-full bg-white rounded-lg border flex flex-col gap-3">
        <div className="w-full flex justify-between gap-2 pt-6 pb-5 px-6">
          <IssueTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            size={filtered.length}
            tabCounts={tabCounts}
          />
          <IssueFilters onFilterChange={handleFilterChange} />
        </div>

        <IssuesTable filters={filters} data={filtered} />

        {isFetching && (
          <div className="px-6 pb-6 text-sm text-muted-foreground">
            Refreshing…
          </div>
        )}
      </div>
    </div>
  )
}

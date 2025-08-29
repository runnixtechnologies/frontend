"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export type AdminFilterValues = {
  type: string
  location: string
  category: string
  status: string[]
  dateRange: string
  searchQuery: string
}

interface AdminFiltersProps {
  onFilterChange?: (filters: AdminFilterValues) => void
}

export function AdminFilters({ onFilterChange }: AdminFiltersProps) {
  const [filters, setFilters] = useState<AdminFilterValues>({
    type: "all-type",
    location: "all-locations",
    category: "",
    status: [],
    dateRange: "all-time",
    searchQuery: "",
  })

  // Category options for the filter dialog
  const categoryOptions = [
    { id: "motorcycle", label: "Motorcycle" },
    { id: "car", label: "Car" },
  ]

  // Handle type change
  const handleTypeChange = (value: string) => {
    const category = value === "all-type" ? "" : value
    const newFilters = { ...filters, category }
    setFilters(newFilters)
    if (onFilterChange) onFilterChange(newFilters)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full h-[28px] py-1 px-2 font-medium font-figtree text-xs text-[#666666] tracking-normal border rounded border-[#E6E6E6] bg-transparent sm:w-fit">
            <SelectValue placeholder="All Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="all-type"
              className="font-figtree font-medium tracking-normal text-[#666666] text-xs/[20px] cursor-pointer"
            >
              All Members
            </SelectItem>
            {categoryOptions?.map((category, index) => (
              <SelectItem
                key={index}
                value={category.id}
                className="font-figtree font-medium tracking-normal text-[#666666] text-xs/[20px] cursor-pointer"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { SearchComponent } from "./search-component"

export type UserFilterValues = {
  searchQuery: string
}

interface UserFiltersProps {
  onFilterChange?: (filters: UserFilterValues) => void
}

export function UserFilters({ onFilterChange }: UserFiltersProps) {
  const [filters, setFilters] = useState<UserFilterValues>({
    searchQuery: "",
  })

  // Search box
  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query }
    setAndEmit(newFilters)
  }

  function setAndEmit(next: UserFilterValues, emitNow = true) {
    setFilters(next)
    if (emitNow && onFilterChange) onFilterChange(next)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative w-full">
        <SearchComponent onSearch={handleSearchChange} placeholder="Search" />
      </div>
    </div>
  )
}

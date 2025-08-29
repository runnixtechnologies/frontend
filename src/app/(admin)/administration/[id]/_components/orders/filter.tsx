"use client"

import { SearchComponent } from "@/app/(admin)/_components/search-component"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"
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
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [showFilterBadge, setShowFilterBadge] = useState(false)

  // Category options for the filter dialog
  const categoryOptions = [
    { id: "Admin", label: "Admin" },
    { id: "Merchants", label: "Merchants" },
    { id: "Riders", label: "Riders" },
    { id: "Users", label: "Users" },
    { id: "Issues", label: "Issues" },
  ]
  // Status options for the filter dialog
  const statusOptions = [
    { id: "Approved", label: "Approved" },
    { id: "Rejected", label: "Rejected" },
    { id: "Initiated", label: "Initiated" },
    { id: "Resolved", label: "Deleted" },
    { id: "Suspended", label: "Suspended" },
    { id: "Deleted", label: "Deleted" },
  ]

  // Handle search query change
  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query }
    setFilters(newFilters)
    updateActiveFiltersCount(newFilters)
    if (onFilterChange) onFilterChange(newFilters)
  }

  // Handle category change in the filter dialog
  const handleCategoryChange = (id: string, checked: boolean) => {
    const newFilters = { ...filters, category: checked ? id : "" }
    setFilters(newFilters)
    updateActiveFiltersCount(newFilters)
  }

  // Handle status change in the filter dialog
  const handleStatusChange = (id: string, checked: boolean) => {
    let newStatus = [...filters.status]

    if (checked) {
      newStatus.push(id)
    } else {
      newStatus = newStatus.filter((status) => status !== id)
    }

    const newFilters = { ...filters, status: newStatus }
    setFilters(newFilters)
    updateActiveFiltersCount(newFilters)
  }

  // Apply filters from the dialog
  const applyFilters = () => {
    if (onFilterChange) onFilterChange(filters)
    updateActiveFiltersCount(filters)
  }

  // Reset all filters
  const resetFilters = () => {
    const defaultFilters = {
      type: "all-type",
      location: "all-locations",
      status: [],
      category: "",
      dateRange: "all-time",
      searchQuery: filters.searchQuery, // Keep the search query
    }
    setFilters(defaultFilters)
    updateActiveFiltersCount(defaultFilters)
    if (onFilterChange) onFilterChange(defaultFilters)
  }

  // Count active filters to show badge
  const updateActiveFiltersCount = (currentFilters: AdminFilterValues) => {
    let count = 0

    if (currentFilters.type !== "all-type") count++
    if (currentFilters.location !== "all-locations") count++
    if (currentFilters.status.length > 0) count++
    if (currentFilters.category !== "") count++
    if (currentFilters.dateRange !== "all-time") count++

    setActiveFiltersCount(count)
    setShowFilterBadge(count > 0)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-[28px] py-1 px-2 font-medium font-figtree text-xs text-[#666666] tracking-normal border rounded border-[#E6E6E6] bg-transparent sm:w-fit relative"
            >
              <Filter className="h-3 w-3 text-[#666666] mr-1.5" />
              Filter
              {showFilterBadge && (
                <Badge className="ml-1.5 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-figtree">Filter Orders</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm font-figtree">Category</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${option.id}`}
                        checked={filters.category === option.id}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(option.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`category-${option.id}`}
                        className="font-figtree font-medium tracking-normal text-[#666666] text-xs/[20px] cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm font-figtree">Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`status-${option.id}`}
                        checked={filters.status.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleStatusChange(option.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`status-${option.id}`}
                        className="font-figtree font-medium tracking-normal text-[#666666] text-xs/[20px] cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="h-8 text-xs font-figtree"
              >
                Reset
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={applyFilters}
                  className="h-8 text-xs font-figtree bg-primary hover:bg-primary"
                >
                  Apply Filters
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showFilterBadge && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-[28px] py-1 px-2 font-medium font-figtree text-xs text-primary"
          >
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
      <div className="relative w-full">
        <SearchComponent onSearch={handleSearchChange} placeholder="Search" />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { SearchComponent } from "@/app/(merchant)/_components/search-component"

export type DeliveryFilterValues = {
  type: string
  location: string
  status: string[]
  dateRange: string
  searchQuery: string
}

interface DeliveryFiltersProps {
  onFilterChange?: (filters: DeliveryFilterValues) => void
}

export function DeliveryFilters({ onFilterChange }: DeliveryFiltersProps) {
  const [filters, setFilters] = useState<DeliveryFilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    dateRange: "all-time",
    searchQuery: "",
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [showFilterBadge, setShowFilterBadge] = useState(false)

  // Status options for the filter dialog
  const statusOptions = [
    { id: "in-transit", label: "In Transit" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ]

  // Date range options for the filter dialog
  const dateRangeOptions = [
    { id: "all-time", label: "All Time" },
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "this-week", label: "This Week" },
    { id: "last-week", label: "Last Week" },
    { id: "this-month", label: "This Month" },
    { id: "last-month", label: "Last Month" },
  ]

  // Handle type change
  const handleTypeChange = (value: string) => {
    const newFilters = { ...filters, type: value }
    setFilters(newFilters)
    updateActiveFiltersCount(newFilters)
    if (onFilterChange) onFilterChange(newFilters)
  }

  // Handle location change
  const handleLocationChange = (value: string) => {
    const newFilters = { ...filters, location: value }
    setFilters(newFilters)
    updateActiveFiltersCount(newFilters)
    if (onFilterChange) onFilterChange(newFilters)
  }

  // Handle search query change
  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query }
    setFilters(newFilters)
    updateActiveFiltersCount(newFilters)
    if (onFilterChange) onFilterChange(newFilters)
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

  // Handle date range change in the filter dialog
  const handleDateRangeChange = (value: string) => {
    const newFilters = { ...filters, dateRange: value }
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
      dateRange: "all-time",
      searchQuery: filters.searchQuery, // Keep the search query
    }
    setFilters(defaultFilters)
    updateActiveFiltersCount(defaultFilters)
    if (onFilterChange) onFilterChange(defaultFilters)
  }

  // Count active filters to show badge
  const updateActiveFiltersCount = (currentFilters: DeliveryFilterValues) => {
    let count = 0

    if (currentFilters.type !== "all-type") count++
    if (currentFilters.location !== "all-locations") count++
    if (currentFilters.status.length > 0) count++
    if (currentFilters.dateRange !== "all-time") count++

    setActiveFiltersCount(count)
    setShowFilterBadge(count > 0)
  }

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full h-[28px] py-1 px-2 font-medium font-figtree text-xs text-[#666666] tracking-normal border rounded border-[#E6E6E6] bg-transparent sm:w-fit">
            <SelectValue placeholder="All Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-type" className="font-figtree text-xs">
              All Type
            </SelectItem>
            <SelectItem value="receive" className="font-figtree text-xs">
              Receive package
            </SelectItem>
            <SelectItem value="send" className="font-figtree text-xs">
              Send Package
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.location} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-full h-[28px] py-1 px-2 font-medium font-figtree text-xs text-[#666666] tracking-normal border rounded border-[#E6E6E6] bg-transparent sm:w-fit">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-locations" className="font-figtree text-xs">
              All Locations
            </SelectItem>
            <SelectItem value="north" className="font-figtree text-xs">
              Abuja
            </SelectItem>
            <SelectItem value="south" className="font-figtree text-xs">
              Kano
            </SelectItem>
            <SelectItem value="east" className="font-figtree text-xs">
              Lagos
            </SelectItem>
            <SelectItem value="west" className="font-figtree text-xs">
              Ibadan
            </SelectItem>
          </SelectContent>
        </Select>

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
              <DialogTitle className="font-figtree">
                Filter Deliveries
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm font-figtree">Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={option.id}
                        checked={filters.status.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleStatusChange(option.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={option.id}
                        className="text-xs font-figtree"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm font-figtree">Date Range</h4>
                <RadioGroup
                  value={filters.dateRange}
                  onValueChange={handleDateRangeChange}
                  className="grid grid-cols-2 gap-2"
                >
                  {dateRangeOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={`date-${option.id}`}
                        className="h-3 w-3"
                      />
                      <Label
                        htmlFor={`date-${option.id}`}
                        className="text-xs font-figtree"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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

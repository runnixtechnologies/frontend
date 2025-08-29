"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"

export function TopMerchantFilters() {
  const [range, setRange] = useState("this-week")

  // Handle location change
  const handleDateRangeChange = (value: string) => {
    setRange(value)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Select value={range} onValueChange={handleDateRangeChange}>
          <SelectTrigger
            className="w-full h-[22px] py-1 px-2 font-medium font-figtree text-xs/[120%] text-[#666666] tracking-normal border rounded border-[#EDEDED] bg-transparent sm:w-fit"
            icon={<ChevronDownIcon className="size-3 text-[#4A464E]" />}
          >
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="last-week">Last Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

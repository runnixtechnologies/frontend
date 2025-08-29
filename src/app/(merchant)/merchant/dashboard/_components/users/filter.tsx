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

export function UsersFilters() {
  const [users, setUsers] = useState("new-users")
  const [range, setRange] = useState("this-week")

  // Handle type change
  const handleUsersChange = (value: string) => {
    setUsers(value)
  }

  // Handle location change
  const handleDateRangeChange = (value: string) => {
    setRange(value)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Select value={users} onValueChange={handleUsersChange}>
          <SelectTrigger
            className="w-full h-[22px] py-1 px-2 font-medium font-figtree text-xs/[120%] text-[#666666] tracking-normal border rounded border-[#EDEDED] bg-transparent sm:w-fit"
            icon={<ChevronDownIcon className="size-3 text-[#4A464E]" />}
          >
            <SelectValue placeholder="New Users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new-users">New Users</SelectItem>
            <SelectItem value="active-users">Active Users</SelectItem>
          </SelectContent>
        </Select>
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

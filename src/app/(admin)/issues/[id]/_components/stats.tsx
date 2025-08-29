"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimePeriod = "Today" | "Last Week" | "This Month" | "Last Month"

interface StatCardProps {
  title: string
  value: string | number
  className?: string
  timeFilter?: boolean
  onTimeChange?: (period: TimePeriod) => void
}

function StatCard({
  title,
  value,
  className,
  timeFilter = false,
  onTimeChange,
}: StatCardProps) {
  const [selectedTime, setSelectedTime] = useState<TimePeriod>("Today")

  const handleTimeChange = (value: string) => {
    const period = value as TimePeriod
    setSelectedTime(period)
    if (onTimeChange) {
      onTimeChange(period)
    }
  }

  return (
    <Card className={cn("h-[92px] p-4 overflow-hidden gap-0", className)}>
      <CardHeader className="flex flex-row gap-4 items-center justify-between">
        <CardTitle className="text-sm font-normal font-figtree text-[#666666] tracking-normal">
          {title}
        </CardTitle>
        {timeFilter && (
          <Select value={selectedTime} onValueChange={handleTimeChange}>
            <SelectTrigger className="w-fit h-[28px] py-1 px-2 font-medium font-figtree text-xs text-[#666666] tracking-normal border rounded border-[#E6E6E6] bg-transparent">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today" className="font-figtree text-xs">
                Today
              </SelectItem>
              <SelectItem value="Last Week" className="font-figtree text-xs">
                Last Week
              </SelectItem>
              <SelectItem value="This Month" className="font-figtree text-xs">
                This Month
              </SelectItem>
              <SelectItem value="Last Month" className="font-figtree text-xs">
                Last Month
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-[28px]/[120%] -tracking-[2%] font-figtree font-semibold text-[#191A1A]">
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

export function MerchantStats() {
  // Sample data for different time periods - using regular objects instead of state
  const revenueData = {
    Today: "5,210,500",
    "Last Week": "114,280",
    "This Month": "152,490",
    "Last Month": "418,320",
  }

  const ordersData = {
    Today: "236",
    "Last Week": "412",
    "This Month": "845",
    "Last Month": "632",
  }
  const visitsData = {
    Today: "65",
    "Last Week": "10",
    "This Month": "7",
    "Last Month": "40",
  }

  const usersData = {
    Today: "75",
    "Last Week": "412",
    "This Month": "845",
    "Last Month": "632",
  }
  const [revenueValue, setRevenueValue] = useState(revenueData["Today"])
  const [ordersValue, setOrdersValue] = useState(ordersData["Today"])
  const [visitsValue, setVisitsValue] = useState(visitsData["Today"])
  const [usersValue, setUsersValue] = useState(usersData["Today"])

  const handleRevenueTimeChange = (period: TimePeriod) => {
    setRevenueValue(revenueData[period])
  }

  const handleOrdersTimeChange = (period: TimePeriod) => {
    setOrdersValue(ordersData[period])
  }

  const handleVisitTimeChange = (period: TimePeriod) => {
    setVisitsValue(revenueData[period])
  }

  const handleUsersTimeChange = (period: TimePeriod) => {
    setUsersValue(ordersData[period])
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        title="Revenue"
        value={`₦ ${revenueValue}`}
        timeFilter={true}
        onTimeChange={handleRevenueTimeChange}
      />
      <StatCard
        title="Orders"
        value={ordersValue}
        timeFilter={true}
        onTimeChange={handleOrdersTimeChange}
      />
      <StatCard
        title="Profile visit"
        value={visitsValue}
        timeFilter={true}
        onTimeChange={handleVisitTimeChange}
      />
      <StatCard
        title="Loyal Users"
        value={usersValue}
        timeFilter={true}
        onTimeChange={handleUsersTimeChange}
      />
      <StatCard title="Avg. Response Time" value="8 mins" timeFilter={false} />
    </div>
  )
}

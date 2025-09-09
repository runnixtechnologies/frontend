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
    <Card
      className={cn(
        "h-[96px] p-4 overflow-hidden gap-0 border rounded-xl border-[#E6E6E6]",
        className
      )}
    >
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

export function TripsStats() {
  // Sample data for different time periods - using regular objects instead of state
  const pendingOrderData = {
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

  const cancelledData = {
    Today: "75",
    "Last Week": "412",
    "This Month": "845",
    "Last Month": "632",
  }
  const [completedOrderValue, setCompletedOrderValue] = useState(
    pendingOrderData["Today"]
  )
  const [pendingValue, setPendingValue] = useState(visitsData["Today"])
  const [cancelledValue, setCancelledValue] = useState(cancelledData["Today"])

  const handleCompletedOrderTimeChange = (period: TimePeriod) => {
    setCompletedOrderValue(pendingOrderData[period])
  }

  const handlePendingOrderTimeChange = (period: TimePeriod) => {
    setPendingValue(pendingOrderData[period])
  }

  const handleCancelledTimeChange = (period: TimePeriod) => {
    setCancelledValue(ordersData[period])
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Completed Order"
        value={`₦ ${completedOrderValue}`}
        timeFilter={true}
        onTimeChange={handleCompletedOrderTimeChange}
      />
      <StatCard
        title="Pending order"
        value={pendingValue}
        timeFilter={false}
        onTimeChange={handlePendingOrderTimeChange}
      />
      <StatCard
        title="Cancelled Orders"
        value={cancelledValue}
        timeFilter={true}
        onTimeChange={handleCancelledTimeChange}
      />
    </div>
  )
}

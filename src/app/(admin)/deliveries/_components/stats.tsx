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
    <Card className={cn("overflow-hidden gap-0", className)}>
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

export function DeliveryStats() {
  // Sample data for different time periods - using regular objects instead of state
  const completedData = {
    Today: "2,365",
    "Last Week": "14,280",
    "This Month": "52,490",
    "Last Month": "48,320",
  }

  const cancelledData = {
    Today: "75",
    "Last Week": "412",
    "This Month": "1,845",
    "Last Month": "1,632",
  }

  const [completedValue, setCompletedValue] = useState(completedData["Today"])
  const [cancelledValue, setCancelledValue] = useState(cancelledData["Today"])

  const handleCompletedTimeChange = (period: TimePeriod) => {
    setCompletedValue(completedData[period])
  }

  const handleCancelledTimeChange = (period: TimePeriod) => {
    setCancelledValue(cancelledData[period])
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard title="Requests" value="336" />
      <StatCard
        title="Completed"
        value={completedValue}
        timeFilter={true}
        onTimeChange={handleCompletedTimeChange}
      />
      <StatCard
        title="Cancelled Trips"
        value={cancelledValue}
        timeFilter={true}
        onTimeChange={handleCancelledTimeChange}
      />
    </div>
  )
}

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
import { useGetOrderStatsQuery } from "@/lib/redux/api/orders"

type TimePeriod = "Today" | "Last Week" | "This Month" | "Last Month"

interface StatCardProps {
  title: string
  value: string | number
  className?: string
  timeFilter?: boolean
  onTimeChange?: (period: TimePeriod) => void
  loading?: boolean
  error?: boolean
}

function StatCard({
  title,
  value,
  className,
  timeFilter = false,
  onTimeChange,
  loading,
  error,
}: StatCardProps) {
  const [selectedTime, setSelectedTime] = useState<TimePeriod>("Today")

  const handleTimeChange = (value: string) => {
    const period = value as TimePeriod
    setSelectedTime(period)
    onTimeChange?.(period)
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
        {loading ? (
          <div className="h-[32px] w-20 bg-gray-200 rounded animate-pulse" />
        ) : error ? (
          <div className="text-[12px] text-red-600">Failed to load</div>
        ) : (
          <div className="text-[28px]/[120%] -tracking-[2%] font-figtree font-semibold text-[#191A1A]">
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TripsStats({ userId }: { userId: number | string }) {
  // Pull live counts from the API
  const { data, isLoading, isError } = useGetOrderStatsQuery({ userId })

  const completed = data?.completed ?? data?.completed ?? data?.completed // just in case, but our slice exposes .completed
  const pending = data?.pending ?? 0
  const cancelled = data?.cancelled ?? 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Completed Orders"
        value={completed ?? 0}
        loading={isLoading}
        error={isError}
        timeFilter={false}
      />
      <StatCard
        title="Pending Orders"
        value={pending ?? 0}
        loading={isLoading}
        error={isError}
        timeFilter={false}
      />
      <StatCard
        title="Cancelled Orders"
        value={cancelled ?? 0}
        loading={isLoading}
        error={isError}
        timeFilter={false}
      />
    </div>
  )
}

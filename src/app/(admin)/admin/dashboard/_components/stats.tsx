"use client"

import { ReactNode, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CircleDollars,
  EncircledShoppingBag,
  EncircleUsers,
} from "@/components/svgs"
import { ChevronDownIcon } from "lucide-react"
import { useGetRecordCountsQuery } from "@/lib/redux/api/dashboard"

type TimePeriod = "Today" | "Last Week" | "This Month" | "Last Month"

interface StatCardProps {
  title: string
  value: string | number
  className?: string
  timeFilter?: boolean
  icon?: ReactNode
  onTimeChange?: (period: TimePeriod) => void
}

function StatCard({
  title,
  value,
  className,
  timeFilter = false,
  onTimeChange,
  icon,
}: StatCardProps) {
  const [selectedTime, setSelectedTime] = useState<TimePeriod>("This Month")

  const handleTimeChange = (value: string) => {
    const period = value as TimePeriod
    setSelectedTime(period)
    onTimeChange?.(period)
  }

  return (
    <Card
      className={cn(
        "bg-[#F7F6FC] flex flex-col gap-1 overflow-hidden p-3 rounded-[12px]",
        className
      )}
    >
      <div className="w-full flex flex-col gap-1">
        <CardHeader className="p-0 flex flex-row gap-4 items-center justify-between">
          <div className="w-full flex flex-row items-center justify-between">
            {timeFilter && (
              <Select value={selectedTime} onValueChange={handleTimeChange}>
                <SelectTrigger
                  className="w-fit h-0 p-0 font-semibold font-figtree text-[10px]/[140%] text-primary tracking-normal border rounded border-none bg-transparent"
                  size="sm"
                  icon={
                    <ChevronDownIcon className="size-[10px] text-primary" />
                  }
                >
                  <SelectValue placeholder="Today" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Today" className="font-figtree text-xs">
                    Today
                  </SelectItem>
                  <SelectItem
                    value="Last Week"
                    className="font-figtree text-xs"
                  >
                    Last Week
                  </SelectItem>
                  <SelectItem
                    value="This Month"
                    className="font-figtree text-xs"
                  >
                    This Month
                  </SelectItem>
                  <SelectItem
                    value="Last Month"
                    className="font-figtree text-xs"
                  >
                    Last Month
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
            {icon}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CardTitle className="text-sm/[120%] font-normal font-figtree text-[#525252] tracking-normal p-0">
            {title}
          </CardTitle>
          <div className="text-[20px]/[120%] tracking-normal font-figtree font-semibold text-[#232323]">
            {value}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export function DashboardStats() {
  const { data, isLoading, isError } = useGetRecordCountsQuery()

  const [revenue, setRevenue] = useState<number | string>(0)
  const [orders, setOrders] = useState<number | string>(0)
  const [users, setUsers] = useState<number | string>(0)
  const [riders, setRiders] = useState<number | string>(0)
  const [merchants, setMerchants] = useState<number | string>(0)

  useEffect(() => {
    if (data) {
      setRevenue(data.revenue)
      setOrders(data.orders)
      setUsers(data.users)
      setRiders(data.riders)
      setMerchants(data.merchants)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="bg-white grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 py-5 px-4 rounded-xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[92px] rounded-[12px] bg-[#F7F6FC] animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white py-5 px-4 rounded-xl">
        <p className="text-sm text-red-600">Failed to load dashboard stats.</p>
      </div>
    )
  }

  return (
    <div className="bg-white grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 py-5 px-4 rounded-xl">
      <StatCard
        title="Revenue"
        value={revenue}
        timeFilter
        icon={<CircleDollars />}
      />
      <StatCard
        title="Orders"
        value={orders}
        timeFilter
        icon={<EncircledShoppingBag />}
      />
      <StatCard
        title="Users"
        value={users}
        timeFilter
        icon={<EncircleUsers />}
      />
      <StatCard
        title="Riders"
        value={riders}
        timeFilter
        icon={<EncircledShoppingBag />}
      />
      <StatCard
        title="Merchants"
        value={merchants}
        timeFilter
        icon={<EncircledShoppingBag />}
      />
    </div>
  )
}

"use client"

import { ReactNode, useState } from "react"
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
    if (onTimeChange) {
      onTimeChange(period)
    }
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
  const revenueData = {
    Today: "2,365",
    "Last Week": "14,280",
    "This Month": "52,490",
    "Last Month": "48,320",
  }

  const ordersData = {
    Today: "75",
    "Last Week": "412",
    "This Month": "1,845",
    "Last Month": "1,632",
  }
  const usersData = {
    Today: "75",
    "Last Week": "412",
    "This Month": "1,845",
    "Last Month": "1,632",
  }
  const ridersData = {
    Today: "75",
    "Last Week": "412",
    "This Month": "1,845",
    "Last Month": "1,632",
  }
  const merchantsData = {
    Today: "75",
    "Last Week": "412",
    "This Month": "1,845",
    "Last Month": "1,632",
  }

  const [revenueValue, setRevenueValue] = useState(revenueData["This Month"])
  const [ordersValue, setOrdersValue] = useState(ordersData["This Month"])
  const [usersValue, setUsersValue] = useState(usersData["This Month"])
  const [ridersValue, setRidersValue] = useState(ridersData["This Month"])
  const [merchantsValue, setMerchantsValue] = useState(
    merchantsData["This Month"]
  )

  const handleRevenueTimeChange = (period: TimePeriod) => {
    setRevenueValue(revenueData[period])
  }

  const handleOrdersTimeChange = (period: TimePeriod) => {
    setOrdersValue(ordersData[period])
  }
  const handleUsersTimeChange = (period: TimePeriod) => {
    setUsersValue(usersData[period])
  }
  const handleRidersTimeChange = (period: TimePeriod) => {
    setRidersValue(ridersData[period])
  }
  const handleMerchantsTimeChange = (period: TimePeriod) => {
    setMerchantsValue(merchantsData[period])
  }
  return (
    <div className="bg-white grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 py-5 px-4 rounded-xl">
      <StatCard
        title="Revenue"
        value={revenueValue}
        timeFilter={true}
        onTimeChange={handleRevenueTimeChange}
        icon={<CircleDollars />}
      />
      <StatCard
        title="Orders"
        value={ordersValue}
        timeFilter={true}
        onTimeChange={handleOrdersTimeChange}
        icon={<EncircledShoppingBag />}
      />
      <StatCard
        title="Users"
        value={usersValue}
        timeFilter={true}
        onTimeChange={handleUsersTimeChange}
        icon={<EncircleUsers />}
      />
      <StatCard
        title="Riders"
        value={ridersValue}
        timeFilter={true}
        onTimeChange={handleRidersTimeChange}
        icon={<EncircledShoppingBag />}
      />
      <StatCard
        title="Merchants"
        value={merchantsValue}
        timeFilter={true}
        onTimeChange={handleMerchantsTimeChange}
        icon={<EncircledShoppingBag />}
      />
    </div>
  )
}

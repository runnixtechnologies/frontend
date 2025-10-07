"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useGetOrderStatsQuery } from "@/lib/redux/api/orders"

type StatCardProps = {
  title: string
  value?: string | number
  className?: string
  isLoading?: boolean
  errorText?: string
}

function StatCard({
  title,
  value,
  className,
  isLoading,
  errorText,
}: StatCardProps) {
  return (
    <Card className={cn("h-[92px] p-4 overflow-hidden gap-0", className)}>
      <CardHeader className="flex flex-row gap-4 items-center justify-between pb-2">
        <CardTitle className="text-sm font-normal font-figtree text-[#666666] tracking-normal">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
        ) : errorText ? (
          <div className="text-sm text-red-600">{errorText}</div>
        ) : (
          <div className="text-[28px]/[120%] -tracking-[2%] font-figtree font-semibold text-[#191A1A]">
            {value ?? "—"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type Props = {
  /** Optional: filter stats for a specific user (your slice supports ?id=) */
  userId?: number | string
}

export function MerchantStats({ userId }: Props) {
  const { data, isLoading, isError, error } = useGetOrderStatsQuery(
    userId ? { userId } : undefined
  )

  // Safe fallback values
  const pending = data?.pending ?? 0
  const inTransit = data?.inTransit ?? 0
  const completed = data?.completed ?? 0
  const cancelled = data?.cancelled ?? 0

  // Turn RTK error into a readable string
  const errorText = React.useMemo(() => {
    if (!isError || !error) return ""
    if (typeof (error as any)?.data?.message === "string") {
      return (error as any).data.message as string
    }
    if ("error" in (error as any) && typeof (error as any).error === "string") {
      return (error as any).error
    }
    try {
      return typeof (error as any).data === "string"
        ? (error as any).data
        : JSON.stringify((error as any).data)
    } catch {
      return "Failed to load"
    }
  }, [isError, error])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        title="Pending Orders"
        value={pending.toLocaleString()}
        isLoading={isLoading}
        errorText={errorText}
      />
      <StatCard
        title="In Transit"
        value={inTransit.toLocaleString()}
        isLoading={isLoading}
        errorText={errorText}
      />
      <StatCard
        title="Completed"
        value={completed.toLocaleString()}
        isLoading={isLoading}
        errorText={errorText}
      />
      <StatCard
        title="Cancelled"
        value={cancelled.toLocaleString()}
        isLoading={isLoading}
        errorText={errorText}
      />
      <StatCard title="Avg. Response Time" value="8 mins" />
    </div>
  )
}

export default MerchantStats

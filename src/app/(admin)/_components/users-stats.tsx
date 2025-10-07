"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetUserStatsQuery } from "@/lib/redux/api/users"
import { cn } from "@/lib/utils"

/* ---------- tiny presentational card ---------- */
function StatCard({
  title,
  value,
  className,
}: {
  title: string
  value: string | number
  className?: string
}) {
  return (
    <Card className={cn("overflow-hidden gap-0", className)}>
      <CardHeader className="flex flex-row gap-4 items-center justify-between">
        <CardTitle className="text-sm font-normal font-figtree text-[#666666]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-[28px]/[120%] -tracking-[2%] font-figtree font-semibold text-[#191A1A]">
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------- skeleton while loading ---------- */
function StatSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-20 bg-gray-100 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function UserStats({ type }: { type: "user" | "rider" | "merchant" }) {
  const { data, isLoading, isError, error, refetch } = useGetUserStatsQuery({
    userType: type,
  })

  const { active, suspended, inactive, newlyAdded } = data ?? {
    active: 0,
    suspended: 0,
    inactive: 0,
    newlyAdded: 0,
  }

  // Always call hooks at top-level
  const total = useMemo(
    () => (active ?? 0) + (suspended ?? 0) + (inactive ?? 0),
    [active, suspended, inactive]
  )

  if (isLoading) {
    return <StatSkeleton />
  }

  if (isError) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="sm:col-span-2 lg:col-span-3 xl:col-span-5">
          <CardHeader>
            <CardTitle className="text-sm font-figtree text-red-600">
              Failed to load user stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {(error as any)?.data?.message ||
                  (error as any)?.error ||
                  "Please try again."}
              </span>
              <button
                className="text-sm font-medium text-primary underline"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fmt = (n: number) => n.toLocaleString()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard title="Total Users" value={fmt(total)} />
      <StatCard title="New Users" value={fmt(newlyAdded)} />
      <StatCard title="Active Users" value={fmt(active)} />
      <StatCard title="Inactive Users" value={fmt(inactive)} />
      <StatCard title="Suspended" value={fmt(suspended)} />
    </div>
  )
}

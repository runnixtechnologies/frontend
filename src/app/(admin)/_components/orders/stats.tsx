"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetOrderStatsQuery } from "@/lib/redux/api/orders"
import { cn } from "@/lib/utils"

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
    <Card
      className={cn(
        "h-24 p-4 overflow-hidden gap-0 border rounded-xl border-[#E6E6E6]",
        className
      )}
    >
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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

export function OrderStats({ userId }: { userId?: string | number }) {
  // pass undefined when no userId so RTK doesn't add a bogus `id` param
  const { data, isLoading, isError, error, refetch } = useGetOrderStatsQuery(
    userId ? { userId } : undefined
  )

  // normalized stats from the API transform
  const {
    pending = 0,
    inTransit = 0,
    cancelled = 0,
    completed = 0,
  } = data ?? {}
console.log("OrderStats data:", data)
  if (isLoading) return <StatSkeleton />

  if (isError) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="sm:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-figtree text-red-600">
              Failed to load order stats
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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Completed Orders" value={completed} />
      <StatCard title="Pending Orders" value={pending} />
      <StatCard title="In Transit" value={inTransit} />
      <StatCard title="Cancelled Orders" value={cancelled} />
    </div>
  )
}

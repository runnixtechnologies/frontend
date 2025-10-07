"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"
import { useGetChartCountsQuery } from "@/lib/redux/api/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/** Allowed chart types per backend */
const CHART_TYPES = ["users", "merchant", "rider", "orders"] as const
export type ChartType = (typeof CHART_TYPES)[number]
function isChartType(x: unknown): x is ChartType {
  return typeof x === "string" && (CHART_TYPES as readonly string[]).includes(x)
}

/** Helpers */
function toISODate(d: Date) {
  // make YYYY-MM-DD without timezone skew
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
function defaultDateFrom(dateCount: number) {
  const d = new Date()
  d.setDate(d.getDate() - Math.max(0, dateCount - 1))
  return toISODate(d)
}

type Props = {
  type: ChartType
  /** If omitted, defaults to today - (dateCount-1) days */
  dateFrom?: string
  dateCount?: number
  status?: string
  color?: string
  label?: string
  className?: string
}

export function UserMetricsChart({
  type = "users",
  dateFrom,
  dateCount = 7,
  status,
  color = "#7F5BAE",
  label = "Count",
  className,
}: Props) {
  // Guard type (just in case)
  const safeType: ChartType = isChartType(type) ? type : "users"

  // Compute dynamic date_from if not provided
  const resolvedDateFrom = dateFrom ?? defaultDateFrom(dateCount)

  const { data, isLoading, isError } = useGetChartCountsQuery({
    type: safeType,
    date_from: resolvedDateFrom,
    date_count: dateCount,
    status,
  })

  const chartData = useMemo(() => {
    const rows = data ?? []
    return rows.map((r) => ({
      x: new Date(r.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      value: Number(r.total ?? 0),
      rawDate: r.date,
    }))
  }, [data])

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      value: { label, color },
    }),
    [label, color]
  )

  if (isLoading) {
    return (
      <div className="h-[200px] rounded-md bg-white">
        <div className="h-full w-full animate-pulse rounded-md bg-gray-50" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-[200px] flex items-center justify-center rounded-md border bg-white text-sm text-red-600">
        Failed to load chart
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323] capitalize">
            {type}
          </CardTitle>
        </div>
        {/* Place filters here if needed */}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={className ?? "h-[200px]"}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="seriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="25%" stopColor={hexToRgba(color, 0.25)} />
                  <stop offset="100%" stopColor={hexToRgba(color, 0)} />
                </linearGradient>
              </defs>

              <CartesianGrid horizontal vertical={false} stroke="#f0f0f0" />

              <XAxis
                dataKey="x"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                allowDecimals={false}
                width={40}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const p = payload[0] as any
                    return (
                      <ChartTooltipContent
                        value={`${p?.value ?? 0}`}
                        label={p?.payload?.rawDate || ""}
                      />
                    )
                  }
                  return null
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#seriesGradient)"
                activeDot={{
                  r: 6,
                  fill: color,
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

/** Utility: convert #RRGGBB to rgba string with opacity */
function hexToRgba(hex: string, alpha = 1) {
  const clean = hex.replace("#", "")
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

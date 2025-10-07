"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useGetTopOrdersByDeviceQuery } from "@/lib/redux/api/dashboard"

type DeviceRow = { name: string; value: number; color: string }

const PALETTE = [
  "#FF875C",
  "#09DE43",
  "#7F5BAE",
  "#1E88E5",
  "#FFB300",
  "#26A69A",
]

const isColorDark = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

const RADIAN = Math.PI / 180

export default function TopOrdersByDeviceCard() {
  const { data, isLoading, isError, refetch } = useGetTopOrdersByDeviceQuery()

  // derive chart rows, total, and legend config from API
  const { chartData, total, chartConfig } = useMemo(() => {
    // dashboardApi should already map to [{ key, total }]
    const rows = ((data ?? []) as { key?: string; total?: number }[]).map(
      (r, i): DeviceRow => ({
        name: String(r.key ?? "Unknown"),
        value: Number(r.total ?? 0),
        color: PALETTE[i % PALETTE.length],
      })
    )

    const total = rows.reduce((s, r) => s + r.value, 0)

    const cfg: ChartConfig = {}
    rows.forEach((r, i) => {
      cfg[`dev_${i}`] = { label: r.name, color: r.color }
    })

    return { chartData: rows, total, chartConfig: cfg }
  }, [data])

  // label renderer uses the memoized chartData
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
    index: number
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const color = isColorDark(chartData[index].color) ? "#fff" : "#232323"

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontWeight: "bold", fontSize: "14px" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="flex flex-col gap-4 px-6 pt-6 pb-[36px] rounded-[12px] bg-white">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-[20px]/[120%] font-figtree font-bold text-[#232323]">
          Orders by Devices
        </CardTitle>
        <Link
          href="/orders"
          className="text-[14px]/[120%] font-semibold text-primary hover:underline"
        >
          See all
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-[400px] grid place-items-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : isError ? (
          <div className="h-[400px] grid place-items-center">
            <button
              onClick={() => refetch()}
              className="underline text-primary"
            >
              Failed to load. Retry
            </button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[400px] grid place-items-center text-sm text-muted-foreground">
            No data
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={150}
                      paddingAngle={2}
                      dataKey="value"
                      cornerRadius={4}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      stroke="none"
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>

                    {/* Center total */}
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        lineHeight: "32px",
                        fill: "#232323",
                      }}
                    >
                      {total.toLocaleString()}
                    </text>
                    <text
                      x="50%"
                      y="50%"
                      dy="20"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontFamily: "figtree",
                        fontSize: "14px",
                        lineHeight: "140%",
                        fill: "#202020",
                      }}
                    >
                      Orders
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="mt-4 space-y-3">
              {chartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="text-base/[160%] text-[#4A464E] font-normal font-figtree">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold font-figtree text-base/[120%] text-[#101928]">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

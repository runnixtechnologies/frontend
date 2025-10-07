"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useGetTopOrdersByLocationQuery } from "@/lib/redux/api/dashboard"

type Row = { name: string; value: number; color: string }
const PALETTE = [
  "#563C76",
  "#674790",
  "#7F5BAE",
  "#8C68BF",
  "#9D84CE",
  "#B7A8DD",
  "#D0C8EA",
  "#E5E0F4",
  "#F0EEF9",
  "#F7F6FC",
]

const isColorDark = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}
const RADIAN = Math.PI / 180

export default function OrdersLocationDonutChart() {
  const { data, isLoading, isError, refetch } = useGetTopOrdersByLocationQuery()
  console.log("data", data)
  // Map API -> chart rows + config + total (memoized)
  const { rows, config, total } = useMemo(() => {
    // expect array of { key, total } if the slice already transforms,
    // else raw: { location, total_orders }
    const src = (data ?? []) as Array<
      | { key?: string; total?: number }
      | { location?: string; total_orders?: number }
    >
    const rows: Row[] = src.map((x, i) => {
      const name = (x as any).key ?? (x as any).location ?? "Unknown"
      const value = Number((x as any).total ?? (x as any).total_orders ?? 0)
      return { name: String(name), value, color: PALETTE[i % PALETTE.length] }
    })
    const total = rows.reduce((s, r) => s + r.value, 0)
    const config: ChartConfig = {}
    rows.forEach(
      (r, i) => (config[`l_${i}`] = { label: r.name, color: r.color })
    )
    return { rows, config, total }
  }, [data])

  const renderPctLabel = ({
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
    const fill = isColorDark(rows[index].color) ? "#fff" : "#232323"
    return (
      <text
        x={x}
        y={y}
        fill={fill}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontWeight: "bold", fontSize: 14 }}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    )
  }

  return (
    <Card className="flex flex-col gap-4 px-6 pt-6 pb-[36px] rounded-[12px] bg-white">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
          Orders by Locations
        </CardTitle>
        <Link
          href="/orders"
          className="text-[16px]/[120%] font-semibold text-purple-600 hover:underline"
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
        ) : rows.length === 0 ? (
          <div className="h-[400px] grid place-items-center text-sm text-muted-foreground">
            No data
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <ChartContainer config={config} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rows}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={150}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                      dataKey="value"
                      cornerRadius={4}
                      stroke="none"
                      labelLine={false}
                      label={renderPctLabel}
                    >
                      {rows.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>

                    {/* centered total */}
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontWeight: "bold",
                        fontSize: 24,
                        lineHeight: "32px",
                        fill: "#232323",
                      }}
                    >
                      {total.toLocaleString()}
                    </text>
                    <text
                      x="50%"
                      y="50%"
                      dy={20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontFamily: "figtree",
                        fontSize: 14,
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

            <div className="mt-8 space-y-6">
              {rows.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <div className="flex items-center">
                    <span
                      className="mr-3 h-4 w-4 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="text-base/[160%] text-[#4A464E] font-normal -tracking-[2%]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-xl/[120%] -tracking-[2%] text-[#101928]">
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

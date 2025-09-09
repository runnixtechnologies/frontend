"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

// 1. Define your data shape
interface OrderTypeData {
  name: string
  value: number
  color: string
}

// 2. Define the minimal props Recharts passes to your label fn
interface CustomizedLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

const data: OrderTypeData[] = [
  { name: "Food", value: 1799, color: "#FF875C" },
  { name: "Supermarket", value: 1689, color: "#FFBA0E" },
  { name: "IT & Gadgets", value: 1573, color: "#7F5BAE" },
  { name: "Fashion & Lifestyle", value: 1368, color: "#09DE43" },
]

// 3. Dynamic total
const total = data.reduce((sum, d) => sum + d.value, 0)

// 4. Helpers
const RADIAN = Math.PI / 180
const isColorDark = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

// 5. Percentage label renderer
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const fill = isColorDark(data[index].color) ? "#FFFFFF" : "#232323"

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontWeight: "bold", fontSize: "14px" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const chartConfig: ChartConfig = {
  food: { label: "Food", color: "#FF875C" },
  supermarket: { label: "Supermarket", color: "#FFBA0E" },
  it: { label: "IT & Gadgets", color: "#7F5BAE" },
  fashion: { label: "Fashion & Lifestyle", color: "#09DE43" },
}

export default function TopOrdersByTypeCard() {
  return (
    <Card className="flex flex-col gap-4 px-6 pt-6 pb-[36px] rounded-[12px] bg-white">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-[20px]/[120%] font-figtree font-bold text-[#232323]">
          Top Orders Type
        </CardTitle>
        <Link
          href="/orders"
          className="text-[14px]/[120%] font-semibold text-primary hover:underline"
        >
          See all
        </Link>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center">
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={150}
                  paddingAngle={2}
                  cornerRadius={4}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  stroke="none"
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                {/* center total */}
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
                  dy={20}
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
          {data.map((item: OrderTypeData, index: number) => (
            <div key={index} className="flex items-center justify-between">
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
      </CardContent>
    </Card>
  )
}

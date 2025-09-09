"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

interface CustomizedLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

const data = [
  { name: "Ikate, Lagos", value: 1799, color: "#563C76" },
  { name: "Shomolu, Lagos", value: 1689, color: "#674790" },
  { name: "Wuse, Abuja", value: 1573, color: "#7F5BAE" },
  { name: "Ajapere, Lagos", value: 1368, color: "#8C68BF" },
  { name: "Gwagwalada, Abuja", value: 1241, color: "#9D84CE" },
  { name: "Nyanya, Abuja", value: 1064, color: "#B7A8DD" },
  { name: "Ikeja, Lagos", value: 935, color: "#D0C8EA" },
  { name: "Mararaba, Abuja", value: 846, color: "#E5E0F4" },
  { name: "Surulere, Lagos", value: 695, color: "#F0EEF9" },
  { name: "Ikotun, Lagos", value: 536, color: "#F7F6FC" },
]

// 1. dynamic total
const total = data.reduce((sum, entry) => sum + entry.value, 0)

const RADIAN = Math.PI / 180

// helper to pick white or dark text
const isColorDark = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

// 2. render function for each % label
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
  const color = isColorDark(data[index].color) ? "#fff" : "#232323"

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontWeight: "bold", fontSize: "16px" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const chartConfig: ChartConfig = {
  ikateLagos: { label: "Ikate, Lagos", color: "#563C76" },
  shomolouLagos: { label: "Shomolu, Lagos", color: "#674790" },
  wuseAbuja: { label: "Wuse, Abuja", color: "#7F5BAE" },
  ajapereLagos: { label: "Ajapere, Lagos", color: "#8C68BF" },
  gwagwaladaAbuja: { label: "Gwagwalada, Abuja", color: "#9D84CE" },
  nyanyaAbuja: { label: "Nyanya, Abuja", color: "#B7A8DD" },
  ikejaLagos: { label: "Ikeja, Lagos", color: "#D0C8EA" },
  mararabaAbuja: { label: "Mararaba, Abuja", color: "#E5E0F4" },
  surulereLagos: { label: "Surulere, Lagos", color: "#F0EEF9" },
  ikotunLagos: { label: "Ikotun, Lagos", color: "#F7F6FC" },
}

export default function OrdersLocationDonutChart() {
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
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                  cornerRadius={4}
                  stroke="none"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                  {/* center label */}
                  <Label
                    position="center"
                    content={() => {
                      // use cx/cy from the real viewBox:
                      // but Label with position="center" will auto-center its content
                      return (
                        <>
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                              fontWeight: "bold",
                              fontSize: "32px",
                              fill: "#232323",
                            }}
                          >
                            {total.toLocaleString()}
                          </text>
                          <text
                            x="50%"
                            y="50%"
                            dy={24}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                              fontSize: "16px",
                              fill: "#202020",
                            }}
                          >
                            Orders
                          </text>
                        </>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-8 space-y-6">
          {data.map((item, idx) => (
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
      </CardContent>
    </Card>
  )
}

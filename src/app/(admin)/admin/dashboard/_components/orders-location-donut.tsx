"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

const data = [
  { name: "Ikate, Lagos", value: 1799, color: "#818cf8" },
  { name: "Shomolu, Lagos", value: 1689, color: "#a78bfa" },
  { name: "Wuse, Abuja", value: 1573, color: "#60a5fa" },
  { name: "Ajapere, Lagos", value: 1368, color: "#4ade80" },
  { name: "Gwagwalada, Abuja", value: 1241, color: "#ec4899" },
  { name: "Nyanya, Abuja", value: 1064, color: "#fbbf24" },
  { name: "Ikeja, Lagos", value: 935, color: "#f87171" },
  { name: "Others", value: 1546, color: "#d1d5db" },
]

const chartConfig: ChartConfig = {
  ikateLagos: {
    label: "Ikate, Lagos",
    color: "#818cf8",
  },
  shomolouLagos: {
    label: "Shomolu, Lagos",
    color: "#a78bfa",
  },
  wuseAbuja: {
    label: "Wuse, Abuja",
    color: "#60a5fa",
  },
  ajapereLagos: {
    label: "Ajapere, Lagos",
    color: "#4ade80",
  },
  gwagwaladaAbuja: {
    label: "Gwagwalada, Abuja",
    color: "#ec4899",
  },
  nyanyaAbuja: {
    label: "Nyanya, Abuja",
    color: "#fbbf24",
  },
  ikejaLagos: {
    label: "Ikeja, Lagos",
    color: "#f87171",
  },
  others: {
    label: "Others",
    color: "#d1d5db",
  },
}

export function OrdersLocationDonutChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={false}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            7,215
          </text>
          <text
            x="50%"
            y="50%"
            dy="20"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "12px", fill: "#888" }}
          >
            Orders
          </text>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

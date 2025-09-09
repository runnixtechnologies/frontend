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

const data = [
  { day: "Sun", orders: 300 },
  { day: "Mon", orders: 380 },
  { day: "Tue", orders: 350 },
  { day: "Wed", orders: 450 },
  { day: "Thu", orders: 320 },
  { day: "Fri", orders: 480 },
  { day: "Sat", orders: 350 },
]

const chartConfig: ChartConfig = {
  orders: {
    label: "Orders",
    color: "#9370DB",
  },
}

export function OrderMetricsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="25%" stopColor="rgba(127, 91, 174, 0.25)" />
              <stop offset="100%" stopColor="rgba(27, 91, 174, 0)" />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={true} vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#888" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#888" }}
            domain={[0, 1000]}
            ticks={[0, 200, 400, 600, 800, 1000]}
            dx={-10}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent
                    value={`${payload[0].value} orders`}
                    label={payload[0].payload.day}
                  />
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#7F5BAE"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#orderGradient)"
            activeDot={{
              r: 6,
              fill: "#7F5BAE",
              stroke: "white",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

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
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { day: "Sun", users: 200 },
  { day: "Mon", users: 280 },
  { day: "Tue", users: 250 },
  { day: "Wed", users: 300 },
  { day: "Thu", users: 230 },
  { day: "Fri", users: 320 },
  { day: "Sat", users: 250 },
]

export function UserMetricsChart() {
  return (
    <ChartContainer className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(147, 112, 219, 0.4)" />
              <stop offset="95%" stopColor="rgba(147, 112, 219, 0.05)" />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={true} vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6E6B71" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6E6B71" }}
            domain={[0, 1000]}
            ticks={[0, 200, 400, 600, 800, 1000]}
            dx={-10}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent
                    value={`${payload[0].value} users`}
                    label={payload[0].payload.day}
                  />
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#9370DB"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#userGradient)"
            activeDot={{
              r: 6,
              fill: "#9370DB",
              stroke: "white",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

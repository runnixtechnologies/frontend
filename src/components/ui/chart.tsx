"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [cssVars, setCssVars] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (!config) return

    const vars: Record<string, string> = {}
    for (const [key, value] of Object.entries(config)) {
      vars[`--color-${key}`] = value.color
    }
    setCssVars(vars)
  }, [config])

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      style={cssVars}
      {...props}
    >
      {children}
    </div>
  )
}

interface ChartTooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content?: React.ReactNode
}

export function ChartTooltip({
  content,
  className,
  children,
  ...props
}: ChartTooltipProps) {
  return (
    <div
      className={cn("rounded-lg border bg-background p-2 shadow-md", className)}
      {...props}
    >
      {content || children}
    </div>
  )
}

interface ChartTooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  value?: string | number
  icon?: React.ReactNode
  color?: string
  suffix?: string
}

export function ChartTooltipContent({
  label,
  value,
  icon,
  color,
  suffix,
  className,
  ...props
}: ChartTooltipContentProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {label ? (
        <div className="flex items-center gap-1">
          {icon ||
            (color ? (
              <Circle
                className="h-2 w-2"
                style={{ fill: color, stroke: color }}
              />
            ) : null)}
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ) : null}
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-bold">{value}</span>
        {suffix ? (
          <span className="text-xs text-muted-foreground">{suffix}</span>
        ) : null}
      </div>
    </div>
  )
}

interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartLegend({ config, className, ...props }: ChartLegendProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-4", className)}
      {...props}
    >
      {Object.entries(config).map(([key, value]) => (
        <div key={key} className="flex items-center gap-1">
          <Circle
            className="h-3 w-3"
            style={{ fill: value.color, stroke: value.color }}
          />
          <span className="text-sm text-muted-foreground">{value.label}</span>
        </div>
      ))}
    </div>
  )
}

interface ChartValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number
  label?: string
  change?: number
}

export function ChartValue({
  value,
  label,
  change,
  className,
  ...props
}: ChartValueProps) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {change ? (
          <div
            className={cn(
              "flex items-center gap-0.5",
              change > 0 ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {change > 0 ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">{Math.abs(change)}%</span>
          </div>
        ) : null}
      </div>
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
    </div>
  )
}

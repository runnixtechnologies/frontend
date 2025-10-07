// app/(admin)/dashboard/_components/top-ordered-items-table.tsx
"use client"

import { useMemo, useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getInitials } from "@/lib/utils"
import { useGetMostOrderedItemsQuery } from "@/lib/redux/api/dashboard"

type RangeKey = "this-week" | "last-week" | "this-month"

/* Helpers */
function pad(n: number) {
  return n < 10 ? `0${n}` : String(n)
}
function fmt(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function startOfWeek(d = new Date()) {
  const day = d.getDay() || 7 // 1..7 (Mon=1)
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  copy.setDate(copy.getDate() - (day - 1))
  return copy
}
function endOfWeek(d = new Date()) {
  const s = startOfWeek(d)
  const e = new Date(s)
  e.setDate(s.getDate() + 6)
  e.setHours(23, 59, 59, 999)
  return e
}
function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}

/** map UI range -> {date_from, date_to} */
function useRange(range: RangeKey) {
  return useMemo(() => {
    const now = new Date()
    let from: Date
    let to: Date

    if (range === "this-week") {
      from = startOfWeek(now)
      to = now
    } else if (range === "last-week") {
      const lastSun = new Date(startOfWeek(now))
      lastSun.setDate(lastSun.getDate() - 1) // last week's Sunday
      from = startOfWeek(lastSun)
      to = endOfWeek(lastSun)
    } else {
      // "this-month"
      from = startOfMonth(now)
      to = now
    }

    return { date_from: fmt(from), date_to: fmt(to) }
  }, [range])
}

export function TopOrderedItemsTable() {
  const [range, setRange] = useState<RangeKey>("this-week")
  const { date_from, date_to } = useRange(range)

  const {
    data: items,
    isLoading,
    isError,
  } = useGetMostOrderedItemsQuery({
    date_from,
    date_to,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            Most Ordered Items
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger
              className="w-full h-[22px] py-1 px-2 font-medium font-figtree text-xs/[120%] text-[#666666] tracking-normal border rounded border-[#EDEDED] bg-transparent sm:w-fit"
              icon={<ChevronDownIcon className="size-3 text-[#4A464E]" />}
            >
              <SelectValue placeholder="This Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F4F6] h-[30px] py-2 px-3 rounded-[8px]">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Orders</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3}>Loading…</TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={3} className="text-red-600">
                  Failed to load items
                </TableCell>
              </TableRow>
            ) : !items || items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No items found for the selected range.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, i) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{i + 1}.</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-[36px] h-[36px]">
                        {/* Supply a logo URL if you have one */}
                        <AvatarImage src="" alt={item.name} />
                        <AvatarFallback>
                          {getInitials(item.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-figtree font-semibold text-[#1F1D21] text-[14px]/[120%] -tracking-[2%]">
                        {item.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

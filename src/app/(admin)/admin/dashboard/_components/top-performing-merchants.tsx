"use client"

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
import { useGetTopMerchantsQuery } from "@/lib/redux/api/dashboard"
import { getInitials } from "@/lib/utils"
import { useMemo } from "react"

type PerfType = "merchant" | "rider"

type Props = {
  /** Which cohort to rank */
  type?: PerfType
  /** ISO 8601 YYYY-MM-DD (inclusive) */
  dateFrom?: string
  /** ISO 8601 YYYY-MM-DD (inclusive) */
  dateTo?: string
  /** Section title */
  title?: string
  /** How many rows to show (local slice after fetch) */
  limit?: number
}

export default function TopPerformingMerchantTable({
  type = "merchant",
  dateFrom,
  dateTo,
  title = "Top Performing Users",
  limit,
}: Props) {
  const { data, isLoading, isError } = useGetTopMerchantsQuery({
    date_from: dateFrom,
    date_to: dateTo,
  })

  const rows = useMemo(() => {
    const list = data ?? []
    return typeof limit === "number" ? list.slice(0, limit) : list
  }, [data, limit])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            {title}
          </CardTitle>
        </div>
        {/* Place filters here if needed */}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-full bg-gray-100 rounded animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-sm text-red-600">
            Failed to load performance data.
          </div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-[#525252]">
            No data for the selected period.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F4F6] h-[30px] py-2 px-3 rounded-[8px]">
                <TableHead className="w-12">#</TableHead>
                <TableHead>{type === "rider" ? "Rider" : "Merchant"}</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((u, idx) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{idx + 1}.</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-[36px] h-[36px]">
                        {/* Your API doesn’t guarantee an avatar URL; fallback to initials */}
                        <AvatarImage src={""} alt={`${u.name} avatar`} />
                        <AvatarFallback>
                          {getInitials(u.name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-figtree font-semibold text-[#1F1D21] text-[14px]/[120%] -tracking-[2%]">
                        {u.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{u.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

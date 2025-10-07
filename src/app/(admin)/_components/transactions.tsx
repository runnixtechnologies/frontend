"use client"

import { CircledArrowDown } from "@/components/svgs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetAllOrdersQuery } from "@/lib/redux/api/orders"
import { ApiUser, useGetSingleUserQuery } from "@/lib/redux/api/users"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"
import { WalletCard } from "./user-wallet"

type PeriodValue = "this-week" | "last-week" | "last-month"

type Props = {
  /** Merchant user id to filter orders (same name used in your Orders API slice) */
  userId: number | string
  userType: "user" | "rider" | "merchant"
}

function startOfWeek(d: Date) {
  const date = new Date(d)
  const day = date.getDay() // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7 // make Monday the start
  date.setDate(date.getDate() - diff)
  date.setHours(0, 0, 0, 0)
  return date
}
function endOfWeek(d: Date) {
  const start = startOfWeek(d)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}
function startOfMonth(d: Date) {
  const date = new Date(d.getFullYear(), d.getMonth(), 1)
  date.setHours(0, 0, 0, 0)
  return date
}

function getRangeFor(period: PeriodValue): { from: string; to: string } {
  const now = new Date()
  if (period === "this-week") {
    const from = startOfWeek(now)
    const to = endOfWeek(now)
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    }
  }
  if (period === "last-week") {
    const end = new Date(startOfWeek(now)) // last week's end = day before this week's start
    end.setDate(end.getDate() - 1)
    const start = startOfWeek(end)
    return {
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
    }
  }
  // last-month
  const lastMonthEnd = new Date(startOfMonth(now))
  lastMonthEnd.setDate(0) // last day of previous month
  const lastMonthStart = startOfMonth(lastMonthEnd)
  return {
    from: lastMonthStart.toISOString().slice(0, 10),
    to: lastMonthEnd.toISOString().slice(0, 10),
  }
}

export default function Transactions({ userType, userId }: Props) {
  const [period, setPeriod] = React.useState<PeriodValue>("this-week")
  const { from, to } = React.useMemo(() => getRangeFor(period), [period])
  const {
    data: singleResp,
    isLoading: userLoading,
    isError: userError,
    refetch: userRefetch,
  } = useGetSingleUserQuery(
    { userType: userType, id: userId },
    { skip: !userId }
  )

  const user: ApiUser | undefined = React.useMemo(() => {
    const r: any = singleResp
    return r?.data ?? r
  }, [singleResp])
  // Pull orders for the merchant userId within date range
  const { data, isLoading, isError, error, refetch } = useGetAllOrdersQuery({
    page: 1,
    limit: 50, // tune as you like or add pagination
    user_id: userId,
    date_from: from,
    date_to: to,
  })

  // Transform orders -> transaction list for your UI
  const transactions = React.useMemo(() => {
    const rows = data?.rows ?? []
    // Each order row becomes a positive transaction (money in)
    return rows.map((o) => ({
      id: o.id,
      orderId: o.id,
      price: o.fee, // already formatted in your mapper: "₦ 123,456"
      // keep “order” so arrow is down/green (credit)
      type: "order" as const,
      // combine date/time like your sample
      date: o.date || "",
    }))
  }, [data])

  const errorText = React.useMemo(() => {
    if (!isError || !error) return ""
    const err = error as any
    if (typeof err?.data?.message === "string") return err.data.message
    if (typeof err?.error === "string") return err.error
    try {
      return typeof err?.data === "string"
        ? err.data
        : JSON.stringify(err?.data)
    } catch {
      return "Failed to load transactions"
    }
  }, [isError, error])

  return (
    <div className="w-full xl:w-[938px] flex flex-col xl:flex-row gap-4">
      <div className="border-0 xl:border-r xl:border-[#E6E6E6] xl:pr-10">
        <div className="w-[505.99px] grid grid-cols-1 gap-[48px]">
          <div className="w-full flex justify-between gap-2">
            <h3 className="font-figtree font-bold text-[20px]/[120%] -tracking-[2%] text-black">
              Transaction History
            </h3>

            <Select
              value={period}
              onValueChange={(v) => setPeriod(v as PeriodValue)}
            >
              <SelectTrigger
                className="w-fit h-[28px] py-1 px-2 font-medium font-figtree text-[14px]/[120%] bg-[#EFEFEF] text-[#656565] tracking-normal rounded border-0"
                icon={<ChevronDownIcon className="size-3 text-[#656565]" />}
              >
                <SelectValue placeholder="this-week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="this-week"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal"
                >
                  This week
                </SelectItem>
                <SelectItem
                  value="last-week"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal"
                >
                  Last week
                </SelectItem>
                <SelectItem
                  value="last-month"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal"
                >
                  Last month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-2 pb-2 border-b border-[#EFEFEF]"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-full">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))
            ) : isError ? (
              <div className="text-sm text-red-600">
                {errorText}{" "}
                <button
                  onClick={() => refetch()}
                  className="underline text-primary"
                >
                  Retry
                </button>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-sm text-[#666]">No transactions found.</div>
            ) : (
              transactions.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 pb-2 border-b border-[#EFEFEF]"
                >
                  {/* Orders/Deposits = money in (down arrow in your original UI); withdrawals would use up arrow */}
                  <CircledArrowDown />
                  <div className="w-full flex items-start">
                    <div className="w-full flex-grow">
                      <p className="font-semibold font-figtree text-[14px]/[120%] tracking-normal text-[#525252]">
                        {`#Order ${item.orderId}`}
                      </p>
                      <div className="w-full flex justify-between items-center">
                        <p className="text-[14px]/[120%] tracking-normal font-semibold font-figtree text-[#3D3D3D]">
                          {item.date}
                        </p>

                        <p
                          className="text-[14px]/[120%] tracking-normal font-semibold font-figtree"
                          style={{ color: "#01B833" }} // orders are credit (+)
                        >
                          {/* fee is already currency formatted in your mapper; add + prefix */}
                          {item.price.startsWith("₦")
                            ? `+${item.price}`
                            : `+₦ ${item.price}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Wallet/Balance (left as-is; wire to a real balance endpoint later if you have one) */}
      <div className="px-8">
        <WalletCard
          user={user}
          isLoading={userLoading}
          isError={userError}
          onRetry={userRefetch}
        />
      </div>
    </div>
  )
}

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getInitials } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"

export function TopOrderedItemsTable() {
  const [range, setRange] = useState("this-week")

  // Handle location change
  const handleDateRangeChange = (value: string) => {
    setRange(value)
  }

  const items = [
    {
      id: 1,
      name: "Tide Laundry Detergent",
      logo: "/images/items/item-1.png",
      orders: 84,
    },
    {
      id: 2,
      name: "Pampers Diapers",
      logo: "/images/items/item-2.png",
      orders: 84,
    },
    {
      id: 3,
      name: "Nestlé Crunch Chocolate Bar",
      logo: "/images/items/item-3.png",
      orders: 84,
    },
    {
      id: 4,
      name: "Easyday",
      logo: "/images/items/item-2.png",
      orders: 84,
    },
    {
      id: 5,
      name: "Reliance SMART",
      logo: "/images/items/item-1.png",
      orders: 84,
    },
    {
      id: 6,
      name: "Nestlé Crunch Chocolate Bar",
      logo: "/images/items/item-3.png",
      orders: 84,
    },
    {
      id: 7,
      name: "Reliance SMART",
      logo: "/images/items/item-2.png",
      orders: 84,
    },
    {
      id: 8,
      name: "Reliance SMART",
      logo: "/images/items/item-1.png",
      orders: 84,
    },
    {
      id: 9,
      name: "Crunch Chocolate Bar",
      logo: "/images/items/item-1.png",
      orders: 84,
    },
    {
      id: 10,
      name: "Reliance SMART",
      logo: "/images/items/item-3.png",
      orders: 84,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            Most Ordered Items
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={handleDateRangeChange}>
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
              <TableHead>Rider</TableHead>
              <TableHead className="text-right">orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}.</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-[36px] h-[36px]">
                      <AvatarImage src={item.logo} alt="Store picture" />
                      <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-figtree font-semibold text-[#1F1D21] text-[14px]/[120%] -tracking-[2%]">
                      {item.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{item.orders}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

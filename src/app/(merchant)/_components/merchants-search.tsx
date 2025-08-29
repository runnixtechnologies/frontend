"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchComponent } from "./search-component"

interface Merchant {
  id: number
  name: string
  email: string
  phone: string
  status: "Active" | "Pending" | "Rejected" | "Suspended"
  joined: string
  orders: number
  businessType?: string
}

interface MerchantsSearchProps {
  initialMerchants: Merchant[]
  showBusinessType?: boolean
}

export function MerchantsSearch({
  initialMerchants,
  showBusinessType = false,
}: MerchantsSearchProps) {
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants)
  const [statusFilter, setStatusFilter] = useState<Record<string, boolean>>({
    Active: true,
    Pending: true,
    Rejected: true,
    Suspended: true,
  })

  const handleSearch = (query: string) => {
    if (!query) {
      // Apply only status filters when query is empty
      setMerchants(
        initialMerchants.filter((merchant) => statusFilter[merchant.status])
      )
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const filtered = initialMerchants.filter(
      (merchant) =>
        statusFilter[merchant.status] &&
        (merchant.name.toLowerCase().includes(lowercaseQuery) ||
          merchant.email.toLowerCase().includes(lowercaseQuery) ||
          merchant.phone.toLowerCase().includes(lowercaseQuery))
    )
    setMerchants(filtered)
  }

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilter((prev) => {
      const newFilter = { ...prev, [status]: checked }

      // Re-apply search with new filters
      const query =
        document.querySelector<HTMLInputElement>('input[type="search"]')
          ?.value || ""
      setTimeout(() => handleSearch(query), 0)

      return newFilter
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchComponent
            onSearch={handleSearch}
            placeholder="Search merchants by name, email, or phone..."
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={statusFilter.Active}
              onCheckedChange={(checked) =>
                handleStatusFilterChange("Active", checked)
              }
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.Pending}
              onCheckedChange={(checked) =>
                handleStatusFilterChange("Pending", checked)
              }
            >
              Pending
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.Rejected}
              onCheckedChange={(checked) =>
                handleStatusFilterChange("Rejected", checked)
              }
            >
              Rejected
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.Suspended}
              onCheckedChange={(checked) =>
                handleStatusFilterChange("Suspended", checked)
              }
            >
              Suspended
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="h-[44px] bg-[#EFEFEF] border-y border-[#F2F2F2]">
                <TableHead>Merchant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                {showBusinessType && <TableHead>Business Type</TableHead>}
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants.length > 0 ? (
                merchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">
                      {merchant.name}
                    </TableCell>
                    <TableCell>{merchant.email}</TableCell>
                    <TableCell>{merchant.phone}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
                          merchant.status === "Active" &&
                            "bg-green-100 text-green-800",
                          merchant.status === "Pending" &&
                            "bg-yellow-100 text-yellow-800",
                          merchant.status === "Rejected" &&
                            "bg-red-100 text-red-800",
                          merchant.status === "Suspended" &&
                            "bg-gray-100 text-gray-800"
                        )}
                      >
                        {merchant.status}
                      </span>
                    </TableCell>
                    {showBusinessType && (
                      <TableCell>{merchant.businessType || "Retail"}</TableCell>
                    )}
                    <TableCell>{merchant.joined}</TableCell>
                    <TableCell>{merchant.orders}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={showBusinessType ? 7 : 6}
                    className="h-24 text-center"
                  >
                    No merchants found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

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
import { TopMerchantFilters } from "./filter"
import { getInitials } from "@/lib/utils"

export function TopMerchantsTable() {
  const merchants = [
    {
      id: 1,
      name: "Triveni Supermarket",
      logo: "/images/merchants/merchant-1.png",
      logoColor: "bg-yellow-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 2,
      name: "Freshworld",
      logo: "/images/merchants/merchant-2.png",
      logoColor: "bg-red-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 3,
      name: "HyperCity",
      logo: "/images/merchants/merchant-3.png",
      logoColor: "bg-yellow-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 4,
      name: "Easyday",
      logo: "/images/merchants/merchant-4.png",
      logoColor: "bg-blue-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 5,
      name: "Reliance SMART",
      logo: "/images/merchants/merchant-5.png",
      logoColor: "bg-red-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 6,
      name: "Reliance SMART",
      logo: "/images/merchants/merchant-6.png",
      logoColor: "bg-red-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 7,
      name: "Reliance SMART",
      logo: "/images/merchants/merchant-4.png",
      logoColor: "bg-red-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 8,
      name: "Reliance SMART",
      logo: "/images/merchants/merchant-1.png",
      logoColor: "bg-red-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 9,
      name: "Reliance SMART",
      logo: "/images/merchants/merchant-5.png",
      logoColor: "bg-red-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
    {
      id: 10,
      name: "Reliance SMART",
      logo: "/images/merchants/merchant-3.png",
      logoColor: "bg-red-500",
      orders: 84,
      visits: 49,
      users: 23,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            Top Performing Merchants
          </CardTitle>
        </div>
        <TopMerchantFilters />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F4F6] h-[30px] py-2 px-3 rounded-[8px]">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Merchant Name</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right">Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.map((merchant) => (
              <TableRow key={merchant.id}>
                <TableCell className="font-medium">{merchant.id}.</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-[36px] h-[36px]">
                      <AvatarImage src={merchant.logo} alt="Store picture" />
                      <AvatarFallback>
                        {getInitials(merchant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-figtree font-semibold text-[#1F1D21] text-[14px]/[120%] -tracking-[2%]">
                      {merchant.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{merchant.orders}</TableCell>
                <TableCell className="text-right">{merchant.visits}</TableCell>
                <TableCell className="text-right">{merchant.users}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

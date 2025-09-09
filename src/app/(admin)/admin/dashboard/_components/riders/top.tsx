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
import { TopRidersFilters } from "./filters"
import { getInitials } from "@/lib/utils"

export function TopPerformingRidersTable() {
  const riders = [
    {
      id: 1,
      name: "Triveni Supermarket",
      logo: "/images/riders/rider-1.jpg",
      deliveries: 84,
    },
    {
      id: 2,
      name: "Freshworld",
      logo: "/images/riders/rider-2.jpg",
      deliveries: 84,
    },
    {
      id: 3,
      name: "HyperCity",
      logo: "/images/riders/rider-3.jpg",
      deliveries: 84,
    },
    {
      id: 4,
      name: "Easyday",
      logo: "/images/riders/rider-2.jpg",
      deliveries: 84,
    },
    {
      id: 5,
      name: "Reliance SMART",
      logo: "/images/riders/rider-1.jpg",
      deliveries: 84,
    },
    {
      id: 6,
      name: "Reliance SMART",
      logo: "/images/riders/rider-3.jpg",
      deliveries: 84,
    },
    {
      id: 7,
      name: "Reliance SMART",
      logo: "/images/riders/rider-2.jpg",
      deliveries: 84,
    },
    {
      id: 8,
      name: "Reliance SMART",
      logo: "/images/riders/rider-1.jpg",
      deliveries: 84,
    },
    {
      id: 9,
      name: "Reliance SMART",
      logo: "/images/riders/rider-3.jpg",
      deliveries: 84,
    },
    {
      id: 10,
      name: "Reliance SMART",
      logo: "/images/riders/rider-2.jpg",
      deliveries: 84,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            Top Performing Riders
          </CardTitle>
        </div>
        <TopRidersFilters />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F4F6] h-[30px] py-2 px-3 rounded-[8px]">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Rider</TableHead>
              <TableHead className="text-right">Deliveries</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {riders.map((rider) => (
              <TableRow key={rider.id}>
                <TableCell className="font-medium">{rider.id}.</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-[36px] h-[36px]">
                      <AvatarImage src={rider.logo} alt="Store picture" />
                      <AvatarFallback>{getInitials(rider.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-figtree font-semibold text-[#1F1D21] text-[14px]/[120%] -tracking-[2%]">
                      {rider.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{rider.deliveries}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

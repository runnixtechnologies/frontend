import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getInitials } from "@/lib/utils"

export function MostOrderedItems() {
  const items = [
    {
      id: 1,
      name: "Tide Laundry Detergent",
      logo: "T",
      logoColor: "bg-blue-500",
      orders: 23,
    },
    {
      id: 2,
      name: "Pampers Diapers",
      logo: "P",
      logoColor: "bg-yellow-500",
      orders: 23,
    },
    {
      id: 3,
      name: "Nestlé Crunch Chocolate Bar",
      logo: "N",
      logoColor: "bg-red-500",
      orders: 23,
    },
    {
      id: 4,
      name: "Dove Bar Soap",
      logo: "D",
      logoColor: "bg-blue-500",
      orders: 23,
    },
    {
      id: 5,
      name: "Lipton Green Tea",
      logo: "L",
      logoColor: "bg-green-500",
      orders: 23,
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Merchant Name</TableHead>
          <TableHead className="text-right">Orders</TableHead>
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
                <span>{item.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">{item.orders}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

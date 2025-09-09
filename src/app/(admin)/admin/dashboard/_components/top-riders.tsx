import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TopRiders() {
  const riders = [
    {
      id: 1,
      name: "Isobo Abam",
      avatar: "/placeholder.svg?height=24&width=24",
      deliveries: 23,
    },
    {
      id: 2,
      name: "Miebi Bembo",
      avatar: "/placeholder.svg?height=24&width=24",
      deliveries: 23,
    },
    {
      id: 3,
      name: "Chisom Anigbogu",
      avatar: "/placeholder.svg?height=24&width=24",
      deliveries: 23,
    },
    {
      id: 4,
      name: "Diobu Ovunda",
      avatar: "/placeholder.svg?height=24&width=24",
      deliveries: 23,
    },
    {
      id: 5,
      name: "Ifedolapo Oyeleke",
      avatar: "/placeholder.svg?height=24&width=24",
      deliveries: 23,
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={rider.avatar || "/placeholder.svg"}
                    alt={rider.name}
                  />
                  <AvatarFallback>{rider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{rider.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">{rider.deliveries}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

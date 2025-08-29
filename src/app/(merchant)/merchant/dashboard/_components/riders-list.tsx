import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"

export function RidersList() {
  const riders = [
    {
      id: 1,
      name: "Yewande Ogunleye",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "3 days ago • 11:23 am",
    },
    {
      id: 2,
      name: "Ismail Kawu",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "2 days ago • 11:23 am",
    },
    {
      id: 3,
      name: "Sade Olowookere",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "2 days ago • 11:23 am",
    },
  ]

  return (
    <div className="space-y-4">
      {riders.map((rider) => (
        <div key={rider.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={rider.avatar || "/placeholder.svg"}
                alt={rider.name}
              />
              <AvatarFallback>{rider.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{rider.name}</div>
              <div className="text-xs text-gray-500">{rider.time}</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      ))}
    </div>
  )
}

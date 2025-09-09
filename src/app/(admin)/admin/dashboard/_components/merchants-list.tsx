import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"

export function MerchantsList() {
  const merchants = [
    {
      id: 1,
      name: "Palm Store",
      logo: "P",
      logoColor: "bg-orange-500",
      time: "2 days ago • 11:23 am",
    },
    {
      id: 2,
      name: "Giant Supermarket",
      logo: "G",
      logoColor: "bg-green-500",
      time: "2 days ago • 11:23 am",
    },
    {
      id: 3,
      name: "Shopping Home",
      logo: "S",
      logoColor: "bg-red-500",
      time: "2 days ago • 11:23 am",
    },
  ]

  return (
    <div className="space-y-4">
      {merchants.map((merchant) => (
        <div key={merchant.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className={`h-8 w-8 ${merchant.logoColor}`}>
              <AvatarFallback className="text-white">
                {merchant.logo}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{merchant.name}</div>
              <div className="text-xs text-gray-500">{merchant.time}</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      ))}
    </div>
  )
}

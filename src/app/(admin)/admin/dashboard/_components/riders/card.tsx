import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInitials } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
const riders = [
  {
    id: 1,
    name: "Yewande Ogunleye",
    avatar: "/images/riders/rider-1.jpg",
    time: "3 days ago • 11:23 am",
  },
  {
    id: 2,
    name: "Ismail Kawu",
    avatar: "/images/riders/rider-2.jpg",
    time: "2 days ago • 11:23 am",
  },
  {
    id: 3,
    name: "Sade Olowookere",
    avatar: "/images/riders/rider-3.jpg",
    time: "2 days ago • 11:23 am",
  },
]

export default function RidersCard() {
  return (
    <Card className="flex flex-col gap-4 px-6 pt-6 pb-[36px] rounded-[12px] bg-white">
      {" "}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            New Riders
          </CardTitle>
        </div>
        <Link
          href="/riders"
          className="text-[14px]/[120%] font-semibold text-primary -tracking-[2%] hover:underline"
        >
          See all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riders.map((rider) => (
            <Link
              href={`/riders/${rider.id}`}
              key={rider.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-[36px] h-[36px]">
                  <AvatarImage src={rider.avatar} alt="Store picture" />
                  <AvatarFallback>{getInitials(rider.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold font-figtree text-[14px]/[120%] -tracking-[2%] text-[#232323]">
                    {rider.name}
                  </div>
                  <div className="text-[12px]/[140%] text-[#525252] font-normal font-figtree -tracking-[2%]">
                    {rider.time}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#525252]" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

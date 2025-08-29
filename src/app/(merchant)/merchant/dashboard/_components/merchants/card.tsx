import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"
import { getInitials } from "@/lib/utils"

const merchants = [
  {
    id: 1,
    name: "Palm Store",
    logo: "/images/merchants/merchant-1.png",
    time: "2 days ago • 11:23 am",
  },
  {
    id: 2,
    name: "Giant Supermarket",
    logo: "/images/merchants/merchant-2.png",
    time: "2 days ago • 11:23 am",
  },
  {
    id: 3,
    name: "Shopping Home",
    logo: "/images/merchants/merchant-3.png",
    time: "2 days ago • 11:23 am",
  },
]
export default function MerchantsCard() {
  return (
    <Card className="flex flex-col gap-4 px-6 pt-6 pb-[36px] rounded-[12px] bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            New Merchants
          </CardTitle>
        </div>
        <Link
          href="/merchants"
          className="text-[14px]/[120%] font-semibold text-primary -tracking-[2%] hover:underline"
        >
          See all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {merchants.map((merchant) => (
            <div
              key={merchant.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-[36px] h-[36px]">
                  <AvatarImage src={merchant.logo} alt="Store picture" />
                  <AvatarFallback>{getInitials(merchant.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold font-figtree text-[14px]/[120%] -tracking-[2%] text-[#232323]">
                    {merchant.name}
                  </div>
                  <div className="text-[12px]/[140%] text-[#525252] font-normal font-figtree -tracking-[2%]">
                    {merchant.time}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#525252]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

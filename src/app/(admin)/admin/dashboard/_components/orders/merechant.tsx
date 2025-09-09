import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { OrderMetricsChart } from "./chart"

export default function OrdersCard() {
  return (
    <Card className="flex flex-col gap-4 px-6 pt-6 pb-[36px] rounded-[12px] bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            Orders
          </CardTitle>
        </div>
        <Link
          href="/orders"
          className="text-[14px]/[120%] font-semibold text-primary -tracking-[2%] hover:underline"
        >
          See all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
          New Orders for the week
        </div>

        <div className="mt-4 h-[200px]">
          <OrderMetricsChart />
        </div>
      </CardContent>
    </Card>
  )
}

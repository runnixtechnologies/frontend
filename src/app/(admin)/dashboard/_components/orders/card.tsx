import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrdersFilters } from "./filter"
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
        <OrdersFilters />
      </CardHeader>
      <CardContent>
        <div className="text-sm/[140%] font-normal font-figtree text-[#4A464E] tracking-normal">
          New Orders for the week
        </div>
        <div className="text-[24px]/[32px] -tracking-[2%] font-bold font-figtree text-[#FF875C]">
          8,689
        </div>
        <div className="mt-4">
          <OrderMetricsChart />
        </div>
      </CardContent>
    </Card>
  )
}

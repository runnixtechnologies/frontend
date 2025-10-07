import NewUserCard from "./_components/new-users"
import TopOrdersByDeviceCard from "./_components/orders/devices"
import TopOrdersByLocationCard from "./_components/orders/location"
import { TopOrderedItemsTable } from "./_components/orders/top-orders"
import TopOrdersByTypeCard from "./_components/orders/type"
import { DashboardStats } from "./_components/stats"
import TopPerformingUsersTable from "./_components/top-performing-merchants"
import TopPerformingRidersTable from "./_components/top-performing-riders"
import { UserMetricsChart } from "./_components/user-chart"

function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F7F6FC]">
      <div className="flex flex-col gap-3 pt-6 pb-12 px-6 flex-1">
        {/* CARDS */}
        <DashboardStats />
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 shrink-0 flex flex-col gap-3">
            <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3">
              <UserMetricsChart type="users" />
              <UserMetricsChart type="orders" />
            </div>

            <TopPerformingUsersTable
              type="merchant"
              title="Top Performance Merchants"
            />
            <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3">
              <TopOrderedItemsTable />
              <TopPerformingRidersTable />
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-4">
            <NewUserCard role="merchant" page="merchants" />
            <NewUserCard role="rider" page="riders" />
            <NewUserCard role="user" page="users" />
            <TopOrdersByTypeCard />
            <TopOrdersByDeviceCard />
            <TopOrdersByLocationCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

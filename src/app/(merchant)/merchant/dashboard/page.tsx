import { DashboardLayout } from "../../_components/dashboard-layout"
import WelcomeOnboard from "../../_components/welcome"
import MerchantsCard from "./_components/merchants/card"
import { TopMerchantsTable } from "./_components/merchants/top-merchants"
import OrdersCard from "./_components/orders/card"
import TopOrdersByDeviceCard from "./_components/orders/devices"
import TopOrdersByLocationCard from "./_components/orders/location"
import { TopOrderedItemsTable } from "./_components/orders/top-orders"
import TopOrdersByTypeCard from "./_components/orders/type"
import RidersCard from "./_components/riders/card"
import { TopPerformingRidersTable } from "./_components/riders/top"
import { DashboardStats } from "./_components/stats"
import UsersCard from "./_components/users/card"

function DashboardPage() {
  const isVerified = false
  return (
    <DashboardLayout>
      {!isVerified ? (
        <WelcomeOnboard />
      ) : (
        <div className="flex min-h-screen w-full flex-col bg-[#F7F6FC]">
          <div className="flex flex-col gap-3 pt-6 pb-12 px-6 flex-1">
            {/* CARDS */}
            <DashboardStats />
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-2 shrink-0 flex flex-col gap-3">
                <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <UsersCard />
                  <OrdersCard />
                </div>
                <TopMerchantsTable />
                <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <TopOrderedItemsTable />
                  <TopPerformingRidersTable />
                </div>
              </div>

              <div className="col-span-1 flex flex-col gap-4">
                <MerchantsCard />
                <RidersCard />
                <TopOrdersByTypeCard />
                <TopOrdersByDeviceCard />
                <TopOrdersByLocationCard />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default DashboardPage

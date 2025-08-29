"use client"
import { DashboardLayout } from "../_components/dashboard-layout"
import ExpressDelivery from "./_components/express"
import StandardDelivery from "./_components/standard"

export default function PricingsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="w-full bg-white rounded-lg pt-[36px] pb-[64px] px-[48px] flex flex-col gap-[64px]">
          <ExpressDelivery />
          <StandardDelivery />
        </div>
      </div>
    </DashboardLayout>
  )
}

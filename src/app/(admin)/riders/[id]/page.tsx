"use client"

import { ArrowBack, Location } from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDownIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DashboardLayout } from "../../_components/dashboard-layout"
import RiderInformation from "./_components/rider"
import { RiderStats } from "./_components/stats"
import RiderDetailTabs, { type TabKey } from "./_components/tabs"
import Transactions from "./_components/transactions"
import { TripsTable } from "./_components/trips"
import VehicleInformation from "./_components/vehicles"

export default function RidersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("trips")
  const [status, setStatus] = useState("active")

  const handleStatusChange = (value: string) => {
    setStatus(value)
  }

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col gap-6 p-4 md:p-6">
        <RiderStats />

        <div className="w-full bg-white rounded-[12px] border flex flex-col gap-6 pt-9 px-9 pb-16">
          <div className="w-full flex justify-between py-1 rounded">
            <Link
              href="/Riders"
              className="font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
            >
              <ArrowBack /> Go back
            </Link>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger
                className="w-fit h-[28px] py-1 px-2 font-medium font-figtree text-[14px]/[120%] bg-[#F0EEF9] text-primary tracking-normal rounded border-0"
                icon={<ChevronDownIcon className="size-3 text-primary" />}
              >
                <SelectValue placeholder="active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="active"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal"
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="suspend"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal"
                >
                  suspend
                </SelectItem>
                <SelectItem
                  value="suspend"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#F83B3B] tracking-normal"
                >
                  Delete
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex gap-4 items-center">
            <Avatar className="w-[100px] h-[100px]">
              <AvatarImage
                src="/images/riders/rider-4.jpg"
                alt="Store picture"
              />
              <AvatarFallback>CR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[#232323] font-figtree font-bold text-[24px]/[32px] -tracking-[2%]">
                  James Saturn
                </h4>
              </div>

              <h4 className="font-figtree font-medium text-base/[120%] text-left tracking-normal text-[#525252]">
                Joined: <span className="font-bold">Sat 4th Oct, 2024</span>
              </h4>
              <div className="w-fit flex gap-1 py-1 px-2 rounded-[54px] bg-[#F7F6FC]">
                <Location className="text-primary w-4 h-4" />{" "}
                <span className="font-figtree font-normal text-[14px]/[140%] tracking-normal text-[#232323]">
                  Mubi, Ilorin
                </span>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-[48px]">
            <RiderDetailTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <div className="w-full">
              {activeTab === "trips" && <TripsTable />}
              {activeTab === "rider" && <RiderInformation />}
              {activeTab === "vehicles" && <VehicleInformation />}
              {activeTab === "transaction" && <Transactions />}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

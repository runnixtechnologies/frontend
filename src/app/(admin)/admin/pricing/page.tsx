"use client"
import { CreatePrice } from "./_components/create-price"
import ExpressDelivery from "./_components/express"
import StandardDelivery from "./_components/standard"

export default function PricingsPage() {
  return (
    <div className="w-full p-4 md:p-6">
      <div className="w-full bg-white rounded-lg pt-[16px] pb-[34px] px-[48px] ">
        <div className="w-full flex justify-end items-end">
          <div className="w-fit">
            <CreatePrice />
          </div>
        </div>
        <div className="w-full flex flex-col gap-[64px]">
          <ExpressDelivery />
          <StandardDelivery />
        </div>
      </div>
    </div>
  )
}

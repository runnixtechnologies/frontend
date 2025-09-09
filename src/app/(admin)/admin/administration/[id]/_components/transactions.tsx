"use client"

import React, { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDownIcon } from "lucide-react"
import { CircledArrowDown, CircledArrowUp } from "@/components/svgs"

export default function AdminTransactions() {
  const [status, setStatus] = useState("active")

  const handleStatusChange = (value: string) => {
    setStatus(value)
  }
  const transactions = [
    {
      id: 1,
      orderId: 368578,
      price: 1500,
      type: "order",
      date: "Mon 01, Aug",
    },
    {
      id: 2,
      orderId: 368578,
      price: 5120,
      type: "deposit",
      date: "Mon 01, Aug",
    },
    {
      id: 3,
      orderId: 368578,
      price: 1500,
      type: "order",
      date: "Mon 01, Aug",
    },
    {
      id: 4,
      orderId: 12345,
      price: 5120,
      type: "withdrawal",
      date: "Mon 01, Aug",
    },
    {
      id: 5,
      orderId: 12345,
      price: 5120,
      type: "order",
      date: "Mon 01, Aug",
    },
    {
      id: 6,
      orderId: 12345,
      price: 5120,
      type: "order",
      date: "Mon 01, Aug",
    },
    {
      id: 7,
      orderId: 12345,
      price: 5120,
      type: "order",
      date: "Mon 01, Aug",
    },
  ]
  return (
    <div className="w-full xl:w-[938px] flex flex-col xl:flex-row gap-4">
      <div className="border-0  xl:border-r xl:border-[#E6E6E6] xl:pr-10">
        <div className="w-[505.99px] grid grid-cols-1 gap-[48px]">
          <div className="w-full flex justify-between gap-2">
            <h3 className="font-figtree font-bold text-[20px]/[120%] -tracking-[2%] text-black">
              Transaction History
            </h3>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger
                className="w-fit h-[28px] py-1 px-2 font-medium font-figtree text-[14px]/[120%] bg-[#EFEFEF] text-[#656565] tracking-normal rounded border-0"
                icon={<ChevronDownIcon className="size-3 text-[#656565]" />}
              >
                <SelectValue placeholder="this-week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="active"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal"
                >
                  This week
                </SelectItem>
                <SelectItem
                  value="last-week"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal"
                >
                  Last week
                </SelectItem>
                <SelectItem
                  value="last-month"
                  className="font-figtree font-medium text-[14px]/[120%] text-[#F83B3B] tracking-normal"
                >
                  Last Month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            {transactions?.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 pb-2 border-b border-[#EFEFEF]"
              >
                {item.type === "deposit" || item.type === "order" ? (
                  <CircledArrowDown />
                ) : (
                  <CircledArrowUp />
                )}
                <div key={index} className="w-full flex items-start">
                  <div className="w-full flex-grow">
                    <p className="font-semibold font-figtree text-[14px]/[120%] tracking-normal text-[#525252]">
                      {item.type === "order"
                        ? `#Order ${item.orderId}`
                        : item.type === "deposit"
                        ? "Deposit"
                        : item.type === "withdrawal"
                        ? "Withdrawal"
                        : null}
                    </p>
                    <div className="w-full flex justify-between items-center">
                      <p className="text-[14px]/[120%] tracking-normal font-semibold font-figtree text-[#3D3D3D]">
                        {item.date}
                      </p>

                      <p
                        className="text-[14px]/[120%] tracking-normal font-semibold font-figtree text-[#3D3D3D]"
                        style={{
                          color:
                            item.type === "deposit" || item.type === "order"
                              ? "#01B833"
                              : "#F83B3B",
                        }}
                      >
                        {item.type === "deposit" || item.type === "order"
                          ? `+${item.price}`
                          : `-${item.price}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-8">
        <div
          className="w-full h-full xl:h-[148px]  xl:w-[319px] flex flex-col justify-between gap-6  p-5 relative bg-[#1B0D2D] rounded-[12px]"
          style={{
            backgroundImage: `url(/images/merchants/wallet-card.svg)`,
          }}
        >
          <div className="w-full h-[108px] flex flex-col gap-4">
            <div className="w-[213px] h-[25px] flex justify-center items-center px-3 py-1 rounded-3xl bg-[#F7F6FC]/50 gap-1 font-figtree font-medium text-[#F7F6FC] text-[14px]/[120%] tracking-normal">
              Paystack Titan <span>&bull;</span>{" "}
              <span className="font-bold">3242353435</span>
            </div>
            <div className="w-full flex flex-col gap-1">
              <h4 className="font-normal font-figtree text-[14px]/[120%] text-[#BDBDBD] tracking-normal">
                Wallet Balance
              </h4>
              <p className="font-bold font-figtree text-[36px]/[120%] text-[#FFFFFF] tracking-normal">
                ₦129,030
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

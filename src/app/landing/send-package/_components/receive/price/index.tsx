"use client"

import {
  AddCardIcon,
  AngleBack,
  ExpressDeliveryIcon,
  LocationCheckedIcon,
  MasterCardType,
  StandardDeliveryIcon,
  WalletIcon,
} from "@/components/svgs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PricingPaymentProps {
  nextStep: () => void
  prevStep: () => void
}

export default function PricingPayment({
  nextStep,
  prevStep,
}: PricingPaymentProps) {
  return (
    <div className="space-y-6">
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault()
          prevStep()
        }}
        className="flex gap-1 items-center text-[#7C7C7C] mb-6"
      >
        <AngleBack /> Go back
      </Link>

      <h1 className="text-4xl font-bold text-[#232323] mb-6">
        Pricing and Payment
      </h1>

      <div className="space-y-6">
        {/* Addresses */}
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="relative mr-3">
              <div className="relative">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border border-[#232323]
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full bg-[#232323]
                    }`}
                  ></div>
                </div>
              </div>
              <div className="absolute left-[8px] top-0 bottom-0 w-[2px]">
                <div
                  className="absolute left-0 w-full border-l border-dashed border-[#232323]"
                  style={{
                    top: 18,
                    height: 40,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <p className="font-figtree font-medium text-[16px]/[140%] tracking-normal text-[#232323]">
                51 Irele-Ilaje Road, Irele, Osun
              </p>
              <p className="text-sm text-[#7C7C7C]">
                51 Irele-Ilaje Road, Irele, Osun
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="-ml-3 mr-1">
              <LocationCheckedIcon />
            </div>
            <div>
              <p className="font-figtree font-medium text-[16px]/[140%] tracking-normal text-[#232323]">
                111 Modakeke-Ife Road, Modakeke, Osun
              </p>
              <p className="font-figtree font-medium text-[14px]/[120%] -tracking-[2%]  text-[#7C7C7C]">
                111 Modakeke-Ife Road, Modakeke, Osun
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Type */}
        <div className="space-y-3">
          <h3 className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal">
            Select Delivery Type
          </h3>
          <RadioGroup defaultValue="express" className="grid grid-cols-2 gap-2">
            <div className="relative">
              <RadioGroupItem
                value="express"
                id="express"
                className="peer sr-only"
              />
              <Label
                htmlFor="express"
                className="flex flex-col p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-[#EFEFEF] peer-data-[state=checked]:bg-[#F7F6FC]"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="w-full flex items-start gap-1">
                    <ExpressDeliveryIcon />
                    <div className="flex flex-col">
                      <h4 className="font-figtree font-bold text-[#232323] text-[12px]/[120%] tracking-normal">
                        Express Delivery
                      </h4>
                      <p className="text-[10px]/[120%] text-[#656565] font-normal -tracking-[2%]">
                        Your delivery will be prioritised
                      </p>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center peer-data-[state=checked]:bg-[#E5E0F4]">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                  </div>
                </div>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem
                value="standard"
                id="standard"
                className="peer sr-only"
              />
              <Label
                htmlFor="standard"
                className="flex flex-col p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-[#EFEFEF] peer-data-[state=checked]:bg-[#F7F6FC]"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <StandardDeliveryIcon />

                    <div className="flex flex-col">
                      <h4 className="font-figtree font-bold text-[#232323] text-[12px]/[120%] tracking-normal ">
                        Standard Delivery
                      </h4>
                      <p className="text-[10px]/[120%] text-[#525252] font-normal -tracking-[2%]">
                        Your delivery will be as fast as possible
                      </p>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center peer-data-[state=checked]:bg-[#E5E0F4]">
                    <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Vehicle Selection */}
        <div className="space-y-3">
          <h3 className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal">
            Select Delivery Vehicle
          </h3>
          <RadioGroup defaultValue="bike" className="space-y-3">
            <div className="relative">
              <RadioGroupItem value="bike" id="bike" className="peer sr-only" />
              <Label
                htmlFor="bike"
                className="h-[80px] py-3 px-4 gap-3 border  rounded-[8px] flex items-center justify-between b-white cursor-pointer peer-data-[state=checked]:border-[#DCDCDC]"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/runnix-bike.svg"
                    alt="Bike"
                    width={40}
                    height={40}
                    className="w-[56px] h-[56px]"
                  />
                  <div>
                    <p className="font-bold font-figtree text-[16px]/[120%] tracking-normal text-[#232323]">
                      Runnix Bike
                    </p>
                    <p className="font-normal font-figtree text-[12px]/[120%] tracking-normal text-[#232323]">
                      13 min away
                    </p>
                  </div>
                </div>
                <p className="font-bold text-[#232323] font-figtree text-[20px]/[120%] tracking-normal">
                  ₦2,000
                </p>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem value="car" id="car" className="peer sr-only" />
              <Label
                htmlFor="car"
                className="h-[80px] py-3 px-4 gap-3 border  rounded-[8px] flex items-center justify-between b-white cursor-pointer peer-data-[state=checked]:border-[#DCDCDC]"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/runnix-car.svg"
                    alt="Car"
                    width={40}
                    height={40}
                    className="w-[56px] h-[56px]"
                  />
                  <div>
                    <p className="font-bold font-figtree text-[16px]/[120%] tracking-normal text-[#232323]">
                      Runnix Car
                    </p>
                    <p className="font-normal font-figtree text-[12px]/[120%] tracking-normal text-[#232323]">
                      13 min away
                    </p>
                  </div>
                </div>
                <p className="font-bold text-[#232323]">₦5,000</p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <h3 className="font-figtree font-medium text-[14px]/[120%] text-[#232323] tracking-normal">
            Select Delivery Vehicle
          </h3>
          <RadioGroup defaultValue="wallet" className="space-y-3">
            <div className="relative">
              <RadioGroupItem
                value="wallet"
                id="wallet"
                className="peer sr-only"
              />
              <Label
                htmlFor="wallet"
                className="flex items-center justify-between p-4 border-b border-x-0 border-t-0 cursor-pointer peer-data-[state=checked]:border-[#EFEFEF]"
              >
                <div className="flex items-center gap-2">
                  <WalletIcon />
                  <div>
                    <p className="font-medium text-[16px]/[140%] text-[#232323] tracking-normal">
                      Wallet (₦12,030 balance)
                    </p>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center peer-data-[state=checked]:bg-[#E5E0F4]">
                  <div className="h-[10px] w-[10px] rounded-full bg-primary"></div>
                </div>
              </Label>
              <div className="mt-2 ml-6">
                <Button className="h-[25px] py-1 px-3 bg-primary hover:bg-primary text-white text-[14px]/[140%] font-semibold font-figtree rounded-[25px] cursor-pointer">
                  Top-up Wallet
                </Button>
              </div>
            </div>

            <div className="relative">
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex items-center justify-between p-4 border-b border-x-0 border-t-0  cursor-pointer peer-data-[state=checked]:border-[#EFEFEF]"
              >
                <div className="flex items-center gap-2">
                  <MasterCardType />

                  <div>
                    <p className="font-medium text-[16px]/[140%] text-[#232323] tracking-normal">
                      •••• 8796
                    </p>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center peer-data-[state=checked]:bg-primary">
                  <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                </div>
              </Label>
            </div>

            <Button
              variant="ghost"
              className="w-full flex items-center justify-start font-medium text-[16px]/[140%] text-[#232323] tracking-normal py-3 cursor-pointer"
            >
              <AddCardIcon />
              Add debit/credit card
              <ChevronRight className="w-5 h-5 ml-auto" />
            </Button>
          </RadioGroup>
        </div>

        {/* Next Button */}
        <Button
          onClick={nextStep}
          type="submit"
          className="w-full h-[46px] py-3 px-5 rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base leading-[120%] -tracking-[2%] text-white"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

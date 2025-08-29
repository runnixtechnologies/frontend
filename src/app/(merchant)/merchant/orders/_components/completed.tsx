"use client"

import {
  LocationCheckedIcon,
  PackageArrived,
  PackageIcon,
} from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { isEmpty } from "lodash"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// Define the timeline stage type
type TimelineStage = {
  id: number
  title: string
  description: string
  timestamp: string
  status: "completed" | "current" | "pending"
}

interface PackageProps {
  selectedDelivery: {
    id: number
    date: string
    time: string
    userName: string
    packs: number
    fee: string
    riderName: string
    riderPhone?: string
    riderImage?: string
    pickupPoint: string
    destination: string
    duration: string
    status: string
    items?: {
      name: string
      price: string
      quantity: number
      selections?: string[]
    }[]
    trackingId?: string
    deliveryService?: {
      name: string
      type: string
      fee: string
    }
  }
  handleMarkAsCompleted: () => void
  handleCancelDelivery: () => void
}
export default function CompletedPackageInformation({
  selectedDelivery,
  handleMarkAsCompleted,
  handleCancelDelivery,
}: PackageProps) {
  const search = useSearchParams()
  const id = search.get("id") || "RN422G4342D43"
  console.log("selectedDelivery", selectedDelivery)
  // Current stage: 2 (Arrived for Pickup)
  const currentStage = 5

  // Define all timeline stages
  const [stages, setStages] = useState<TimelineStage[]>([
    {
      id: 1,
      title: "Trip Starts",
      description: "Rider Enroute to Pickup package",
      timestamp: "3:13 pm",
      status: "completed",
    },
    {
      id: 2,
      title: "Arrived for Pickup",
      description: "Rider has arrived for pickup",
      timestamp: "2 Jan, 3:45 pm",
      status: "current",
    },
    {
      id: 3,
      title: "Package in Transit",
      description: "Rider enroute to delivery location",
      timestamp: "2 Jan, 3:57 pm",
      status: "pending",
    },
    {
      id: 4,
      title: "Arrived at Destination",
      description: "Rider Enroute to Pickup package",
      timestamp: "2 Jan, 4:32 pm",
      status: "pending",
    },
    {
      id: 5,
      title: "Package Delivered",
      description: "Pending",
      timestamp: "",
      status: "pending",
    },
  ])

  // Update stage statuses when currentStage changes
  useEffect(() => {
    const updatedStages = stages.map((stage) => {
      if (stage.id < currentStage) {
        return { ...stage, status: "completed" as const }
      } else if (stage.id === currentStage) {
        return { ...stage, status: "current" as const }
      } else {
        return { ...stage, status: "pending" as const }
      }
    })
    setStages(updatedStages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage])

  useEffect(() => {
    if (isEmpty(id)) return
  }, [id])

  return (
    <div className="w-full flex flex-col lg:flex-row h-full max-h-[85vh] overflow-y-auto justify-between">
      {/* Left Column */}
      <div className="flex flex-col gap-6 lg:w-[488px]">
        {/* Header section */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <PackageIcon />
            </div>
          </div>
          <span className="h-[35px] font-figtree font-bold bg-[#01B833] text-white px-3 py-2 rounded-xl text-base leading-[120%] -tracking-[2%]">
            Completed
          </span>
        </div>
        {/* Package details */}
        <div className="flex flex-col gap-1">
          <h4 className="text-[24px]/[110%] xl:text-[36px]/[110%] font-figtree tracking-normal font-bold text-[#232323] dark:text-white">
            Jollof Rice + Beef
          </h4>
          <div className="flex items-center gap-2">
            <Avatar className="w-[18px] h-[18px]">
              <AvatarImage
                src="/images/chicken-republic_img.webp"
                alt="Store picture"
              />
              <AvatarFallback>CR</AvatarFallback>
            </Avatar>
            <span className="text-[#525252] dark:text-white font-figtree font-normal text-[16px]/[140%] tracking-normal">
              Chicken Republic
            </span>
          </div>
          <div className="font-normal font-figtree text-[#525252] dark:text-white text-[14px]/[140%] tracking-normal flex items-center gap-2">
            <span>Ordered by:</span>
            <div className="flex items-center gap-1">
              <Avatar className="w-[18px] h-[18px]">
                <AvatarImage
                  src="/images/smart_delivery-img_3.webp"
                  alt="user picture"
                />
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
              <span className="font-figtree font-semibold text-[#232323] dark:text-white text-[16px]/[120%] tracking-normal">
                James Saturn
              </span>
            </div>
          </div>
          <div className="font-normal font-figtree text-[#525252] dark:text-white text-[14px]/[140%] tracking-normal">
            Tracking ID: <span className="font-semibold"> {id}</span>
          </div>
          <div className="mt-3">
            <Button
              onClick={handleMarkAsCompleted}
              className="bg-primary text-white w-fit"
            >
              Mark as Completed
            </Button>
          </div>
        </div>
        {/* Addresses */}
        <div className="">
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
            <div className="-ml-[3px] mr-1">
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
        {/* delivery type */}
        <div className="relative ">
          <div className="bg-[#EFEFEF] h-[80px] py-3 px-4 gap-3 border  rounded-md flex items-center justify-between cursor-pointer">
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
                  Express delivery
                </p>
              </div>
            </div>
            <p className="font-bold text-[#232323] font-figtree text-[20px]/[120%] tracking-normal">
              ₦2,000
            </p>
          </div>
        </div>
        {/* Stage Controls (for demonstration) */}
        <h2 className="text-[16px]/[120%] xl:text-[24px]/[120%] font-figtree font-bold text-[#232323] dark:text-white tracking-normal">
          Package Tracker
        </h2>

        <div className="relative border-b border-[#EFEFEF] pb-6">
          {/* Timeline line - with orange and gray sections */}
          <div className="absolute left-[7px] top-[12px] bottom-0 w-[2px]">
            {/* Active part of timeline (orange) - adjust height based on current stage */}
            <div
              className="absolute left-0 top-0 w-full border-l border-dashed border-[#FF875C]"
              style={{ height: `${(currentStage - 1) * 53 + 12}px` }}
            ></div>
            {/* Inactive part of timeline (grey) */}
            <div
              className="absolute left-0 w-full border-l border-dashed border-[#7C7C7C]"
              style={{
                top: `${(currentStage - 1) * 53 + 12}px`,
                height: `${(5 - currentStage) * 53}px`,
              }}
            ></div>
          </div>

          {/* Timeline items */}
          <div className="space-y-6">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-start gap-2 z-10">
                {stage.title === "Arrived at Destination" ? (
                  <PackageArrived />
                ) : (
                  <div className="relative">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        stage.status !== "pending"
                          ? "border-[0.3px] border-[#FF875C]"
                          : "border-[0.3px] border-[#7C7C7C]"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          stage.status !== "pending"
                            ? "bg-[#FF875C]"
                            : "bg-[#7C7C7C]"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`font-figtree font-medium text-[16px]/[140%] tracking-normal align-middle -mt-1 ${
                          stage.status !== "pending"
                            ? "text-[#232323] dark:text-white"
                            : "text-[#7C7C7C]"
                        }`}
                      >
                        {stage.title}
                      </h3>
                      <p className="font-normal font-figtree text-[#7C7C7C] text-[14px]/[120%] -tracking-[2%] align-middle">
                        {stage.description}
                      </p>
                    </div>
                    {stage.timestamp && (
                      <span className="text-[#BDBDBD] text-[14px]/[120%] font-figtree font-semibold -tracking-[2%] align-middle">
                        {stage.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Courier info */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[16px]/[120%] xl:text-[18px]/[120%] font-figtree font-semibold text-[#232323] dark:text-white tracking-normal">
            Rider
          </h2>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src="/images/smart_delivery-img_3.webp"
                alt="user picture"
              />
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-figtree font-semibold text-[#232323] dark:text-white text-[18px]/[120%] tracking-normal">
                James Saturn
              </h3>
              <p className="font-normal font-figtree text-[#7C7C7C] text-[14px]/[120%] tracking-normal align-middle">
                08036346688
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCancelDelivery}
          variant="outline"
          className="w-full text-[#F83B3B] hover:text-[#F83B3B] border-[#F83B3B] py-4 px-5 font-bold text-[16px]/[120%] -tracking-[-2%] font-figtree cursor-pointer"
        >
          Cancel Delivery
        </Button>
      </div>
      {/* Right Column */}
      <div className="w-[360px] p-6 flex flex-col gap-5 pl-8 border-l border-[#EFEFEF]">
        {/* Picture from Rider */}
        <div className="flex flex-col gap-3">
          <h3 className="font-figtree font-bold text-lg/[120%] text-[#232323]  tracking-normal">
            Picture from Rider
          </h3>
          <div className="w-full h-[164px] rounded-md">
            <Image
              src="/package.png"
              alt="Package"
              width={360}
              height={164}
              quality={80}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
        <div className="bg-[#F0EEF9] rounded-md p-3 flex flex-col gap-[8px]">
          <h3 className="font-bold font-figtree text-[12px]/[120%] text-[#464646] tracking-normal">
            Note for Rider
          </h3>
          <p className="flex items-centerfont-figtree font-normal text-sm leading-[140%] tracking-normal text-[#232323]">
            Velit id lectus massa euismod commodo sit feugiat. Morbi nibh
            tristique sapien diam scelerisque fringilla urna diam tincidunt.
          </p>
        </div>
      </div>
    </div>
  )
}

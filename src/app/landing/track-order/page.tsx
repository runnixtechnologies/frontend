"use client"

import { CircledPhone, PackageArrived, PackageIcon } from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { isEmpty } from "lodash"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import TrackAnotherPackage from "./_components/TrackAnotherPackage"

// Define the timeline stage type
type TimelineStage = {
  id: number
  title: string
  description: string
  timestamp: string
  status: "completed" | "current" | "pending"
}

export default function PackageInformation() {
  const search = useSearchParams()
  const id = search.get("id") || "RN422G4342D43"

  // Current stage: 2 (Arrived for Pickup)
  const currentStage = 4

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
    <div
      className="w-full dark:bg-[#161226] bg-white min-h-[519px] relative xl:pt-10 pb-15"
      aria-label="Track ride page"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <PackageIcon />
            </div>
          </div>
          <span className="h-[35px] font-figtree font-bold bg-primary text-white px-3 py-2 rounded-xl text-base leading-[120%] -tracking-[2%]">
            37 mins away
          </span>
        </div>

        {/* Package details */}
        <div className="mb-12 flex flex-col gap-1">
          <h4 className="text-[24px]/[110%] xl:text-[36px]/[110%] font-figtree tracking-normal font-bold text-[#232323] dark:text-white">
            Jollof Rice + Beef
          </h4>
          <div className="flex items-center gap-2 mb-1">
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
            Tracking ID: {id}
          </div>
        </div>

        {/* Stage Controls (for demonstration) */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px]/[120%] xl:text-[24px]/[120%] font-figtree font-bold text-[#232323] dark:text-white tracking-normal">
            Package Tracker
          </h2>

          <Link
            href="#"
            className="text-primary text-[14px]/[120%] xl:text-[16px]/[120%] font-bold font-figtree -tracking-[2%]"
          >
            Track in Runnix App
          </Link>
        </div>

        <div className="relative">
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

        {/* Divider */}
        <div className="h-px bg-[#EFEFEF] my-8"></div>

        {/* Courier info */}
        <div className="flex justify-between items-center mb-8">
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
                Courier Rider
              </p>
            </div>
          </div>
          <Link href="tel:08142445807">
            <CircledPhone />
          </Link>
        </div>

        <div className="flex justify-end mb-8">
          <Link
            href="/contact"
            className="text-primary font-bold text-[16px]/[120%] -tracking-[-2%] font-figtree cursor-pointer"
          >
            Report Delivery
          </Link>
        </div>

        {/* Bottom buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrackAnotherPackage />
          <Button className="hidden lg:flex h-[51px] py-4 px-5 bg-primary text-white rounded-[12px] font-bold text-[16px]/[120%] -tracking-[-2%] font-figtree">
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}

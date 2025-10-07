"use client"

import { LocationCheckedIcon, PackageIcon } from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useDeliveryDetail } from "./useDeliveryDetail"

type Props = {
  deliveryId: number | string
}

const pillByStatus: Record<string, { label: string; cls: string }> = {
  cancelled: { label: "Cancelled", cls: "bg-[#FFF1F1] text-[#F83B3B]" },
  completed: { label: "Completed", cls: "bg-[#E9FAF1] text-[#0F9D58]" },
  delivered: { label: "Completed", cls: "bg-[#E9FAF1] text-[#0F9D58]" },
  pending: { label: "Pending", cls: "bg-[#EFEFEF] text-[#232323]" },
  in_transit: { label: "In Transit", cls: "bg-[#EBF5FF] text-[#1D4ED8]" },
  assigned: { label: "Assigned", cls: "bg-[#EFEFEF] text-[#232323]" },
  default: { label: "—", cls: "bg-[#EFEFEF] text-[#232323]" },
}

export default function DeliveryDetailBase({ deliveryId }: Props) {
  const { data, isLoading, isError } = useDeliveryDetail(deliveryId)

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-40 w-full bg-gray-50 rounded animate-pulse" />
      </div>
    )
  }
  if (isError || !data) {
    return (
      <div className="p-8 text-red-600">Failed to load delivery details.</div>
    )
  }

  const pill = pillByStatus[data.status] ?? pillByStatus.default

  return (
    <div className="w-full flex flex-col lg:flex-row h-full max-h-[85vh] overflow-y-auto justify-between">
      {/* Left Column */}
      <div className="flex flex-col gap-6 lg:w-[488px]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <PackageIcon />
            </div>
          </div>
          <span
            className={`h-[35px] px-3 py-2 rounded-xl font-figtree font-bold text-base leading-[120%] -tracking-[2%] ${pill.cls}`}
          >
            {pill.label}
          </span>
        </div>

        {/* Title & Who */}
        <div className="flex flex-col gap-1">
          <h4 className="text-[24px]/[110%] xl:text-[36px]/[110%] font-figtree tracking-normal font-bold text-[#232323]">
            Send Package
          </h4>

          <div className="flex items-center gap-2">
            <Avatar className="w-[18px] h-[18px]">
              <AvatarImage
                src={"/images/chicken-republic_img.webp"}
                alt="Store / Rider"
              />
              <AvatarFallback>RD</AvatarFallback>
            </Avatar>
            <span className="text-[#525252] font-figtree text-[16px]/[140%]">
              {data.userName}
            </span>
          </div>

          <div className="font-figtree text-[#525252] text-[14px]/[140%] flex items-center gap-2">
            <span>Ordered by:</span>
            <div className="flex items-center gap-1">
              <Avatar className="w-[18px] h-[18px]">
                <AvatarImage
                  src="/images/smart_delivery-img_3.webp"
                  alt="user picture"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="font-figtree font-semibold text-[#232323] text-[16px]/[120%]">
                {data.userName}
              </span>
            </div>
          </div>

          <div className="font-figtree text-[#525252] text-[14px]/[140%]">
            Tracking ID:{" "}
            <span className="font-semibold">
              {data.trackingId ?? `RN${data.id}`}
            </span>
          </div>
        </div>

        {/* Addresses */}
        <div>
          <div className="flex items-start">
            <div className="relative mr-3">
              <div className="relative">
                <div className="w-4 h-4 rounded-full flex items-center justify-center border border-[#232323]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#232323]" />
                </div>
              </div>
              <div className="absolute left-[8px] top-0 bottom-0 w-[2px]">
                <div
                  className="absolute left-0 w-full border-l border-dashed border-[#232323]"
                  style={{ top: 18, height: 40 }}
                />
              </div>
            </div>

            <div>
              <p className="font-figtree font-medium text-[16px]/[140%] text-[#232323]">
                {data.pickupPoint || "Pickup address not available"}
              </p>
              <p className="text-sm text-[#7C7C7C]">
                {data.pickupPoint || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start mt-2">
            <div className="-ml-[3px] mr-1">
              <LocationCheckedIcon />
            </div>
            <div>
              <p className="font-figtree font-medium text-[16px]/[140%] text-[#232323]">
                {data.destination}
              </p>
              <p className="font-figtree font-medium text-[14px]/[120%] text-[#7C7C7C]">
                {data.destination}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery service */}
        <div className="relative">
          <div className="bg-[#EFEFEF] h-[80px] py-3 px-4 gap-3 border rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/runnix-bike.svg"
                alt="Bike"
                width={56}
                height={56}
                className="w-[56px] h-[56px]"
              />
              <div>
                <p className="font-bold font-figtree text-[16px]/[120%] text-[#232323]">
                  {data.deliveryService?.name ?? "Runnix Bike"}
                </p>
                <p className="font-figtree text-[12px]/[120%] text-[#232323]">
                  {data.deliveryService?.type ?? "Express delivery"}
                </p>
              </div>
            </div>
            <p className="font-bold text-[#232323] font-figtree text-[20px]/[120%]">
              {data.deliveryService?.fee ?? data.fee}
            </p>
          </div>
        </div>

        {/* Rider */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[16px]/[120%] xl:text-[18px]/[120%] font-figtree font-semibold text-[#232323]">
            Rider
          </h2>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={data.riderImage || "/images/smart_delivery-img_3.webp"}
                alt="rider picture"
              />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-figtree font-semibold text-[#232323] text-[18px]/[120%]">
                {data.riderName}
              </h3>
              <p className="font-figtree text-[#7C7C7C] text-[14px]/[120%]">
                {data.riderPhone || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-[360px] p-6 flex flex-col gap-5 pl-8 border-l border-[#EFEFEF]">
        {/* If/when you get items from backend, render them like this: */}
        {data.items?.length ? (
          <div className="flex flex-col gap-5">
            <h3 className="font-figtree font-bold text-lg/[120%] text-[#232323]">
              Order {data.id}
            </h3>
            {data.items.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3">
                  <div className="w-12 h-12 bg-amber-200 rounded-md overflow-hidden">
                    <Image
                      src={`/jollof-rice.png`}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold font-figtree text-[16px]/[120%] text-[#232323]">
                      {item.name}
                    </p>
                    <p className="whitespace-nowrap font-bold font-figtree text-[18px]/[120%] text-[#232323]">
                      x{item.quantity}
                    </p>
                  </div>
                  <p className="text-[14px]/[120%] font-figtree text-[#3D3D3D]">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <h3 className="font-figtree font-bold text-lg/[120%] text-[#232323]">
              Order {data.id}
            </h3>
            <div className="p-3 rounded-md">
              <div className="flex justify-between">
                <p className="font-semibold font-figtree text-[12px]/[120%] text-[#232323]">
                  {data.deliveryType} Delivery
                </p>
                <p className="whitespace-nowrap font-bold font-figtree text-[18px]/[120%] text-[#232323]">
                  x1
                </p>
              </div>
              <p className="text-[14px]/[120%] font-figtree text-[#3D3D3D]">
                {data.fee}
              </p>
            </div>
          </div>
        )}

        {/* Picture from Rider */}
        <div className="flex flex-col gap-3">
          <h3 className="font-figtree font-bold text-lg/[120%] text-[#232323]">
            Picture from Rider
          </h3>
        </div>
        <div className="w-full h-[164px] rounded-md overflow-hidden">
          <Image
            src="/package.png"
            alt="Package"
            width={360}
            height={164}
            quality={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Notes (examples) */}
        <div className="bg-[#F0EEF9] rounded-md p-3 flex flex-col gap-2">
          <h3 className="font-bold font-figtree text-[12px]/[120%] text-[#464646]">
            Note for Rider
          </h3>
          <p className="font-figtree text-sm leading-[140%] text-[#232323]">
            Velit id lectus massa euismod commodo sit feugiat. Morbi nibh
            tristique sapien diam scelerisque fringilla urna diam tincidunt.
          </p>
        </div>

        {/* Actions – leave buttons in parent if you have them there. */}
        {/* You can render optional CTA slot here if needed */}
      </div>
    </div>
  )
}

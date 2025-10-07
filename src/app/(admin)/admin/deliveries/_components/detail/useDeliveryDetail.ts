"use client"

import { useMemo } from "react"
import {
  useGetSingleDeliveryQuery,
  type ApiDelivery,
} from "@/lib/redux/api/deliveries"

export type UiDelivery = {
  id: number
  createdDate: string
  createdTime: string
  userName: string
  deliveryType: "send" | "receive"
  fee: string
  riderName: string
  riderPhone?: string
  riderImage?: string
  pickupPoint: string
  destination: string
  duration: string
  status:
    | "pending"
    | "in_transit"
    | "completed"
    | "cancelled"
    | "assigned"
    | string
  items?: {
    name: string
    price: string
    quantity: number
    selections?: string[]
  }[]
  trackingId?: string
  deliveryService?: { name: string; type: string; fee: string }
}

const toCurrency = (n: string | number | null | undefined) =>
  `₦ ${Number(n ?? 0).toLocaleString("en-NG")}`

function mapApiToUi(d: ApiDelivery): UiDelivery {
  const dt = new Date(d.created_at)
  const createdDate = dt.toLocaleDateString()
  const createdTime = dt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const userName =
    [d.sender?.profile?.first_name, d.sender?.profile?.last_name]
      .filter(Boolean)
      .join(" ") ||
    d.sender?.email ||
    d.sender?.phone ||
    String(d.sender_id)

  const riderName =
    [d.rider?.profile?.first_name, d.rider?.profile?.last_name]
      .filter(Boolean)
      .join(" ") ||
    d.rider?.email ||
    d.rider?.phone ||
    (d.rider_id != null ? String(d.rider_id) : "-")

  const riderImage = d.rider?.profile?.profile_image ?? undefined

  return {
    id: d.id,
    createdDate,
    createdTime,
    userName,
    deliveryType: "send",
    fee: toCurrency(d.delivery_fee),
    riderName,
    riderPhone: d.rider?.phone ?? undefined,
    riderImage,
    pickupPoint: d.receiver_address || "-", // your design shows pickup first, switch if needed
    destination: d.receiver_address || "-",
    duration: String(d.duration ?? "-"),
    // keep raw API status to style accurately
    status: (d.status || "").toLowerCase(),
    items: undefined, // you can wire order items if backend provides
    trackingId: d.package_number,
    deliveryService: {
      name: "Runnix Bike",
      type: "Express delivery",
      fee: toCurrency(d.delivery_fee),
    },
  }
}

export function useDeliveryDetail(deliveryId: number | string) {
  const q = useGetSingleDeliveryQuery(deliveryId)
  const data = useMemo(() => {
    const api = q.data
    return api ? mapApiToUi(api) : undefined
  }, [q.data])

  return {
    ...q,
    data,
  }
}

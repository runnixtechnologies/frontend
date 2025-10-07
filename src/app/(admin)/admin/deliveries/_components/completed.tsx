"use client"

import DeliveryDetailBase from "./detail/DeliveryDetailBase"

type Props = {
  deliveryId: number | string
  handleMarkAsCompleted: () => void | Promise<void>
  handleCancelDelivery: () => void | Promise<void>
}

export default function CompletedPackageInformation(props: Props) {
  return <DeliveryDetailBase {...props} />
}

// app/(admin)/admin/merchants/[id]/page.tsx
"use client"

import { ArrowBack, Location } from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useGetSingleUserQuery, type ApiUser } from "@/lib/redux/api/users"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import UserInformation from "../../../_components/info"
import { OrdersTable } from "../../../_components/orders"
import Transactions from "../../../_components/transactions"
import { UserStatusButton } from "../../../_components/update-status"
import Products from "./_components/products"
import MerchantDetailTabs, { type TabKey } from "./_components/tabs"
import {
  getDisplayName,
  getAvatarUrl,
  getInitials,
  mapStatusNumericToText,
} from "@/lib/redux/users/selectors"

export default function UserDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("orders")
  const params = useParams<{ userId?: string; id?: string }>()
  const userId = Number(params?.userId ?? params?.id ?? "")

  const userType: "user" | "rider" | "merchant" = "merchant"

  const {
    data: singleResp,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSingleUserQuery({ userType, id: userId }, { skip: !userId })

  const user: ApiUser | undefined = useMemo(
    () => (singleResp as any)?.data ?? (singleResp as any),
    [singleResp]
  )

  const fullName = getDisplayName(user) // person name from profile
  const avatarUrl = getAvatarUrl(user) // may be null → fallback shows initials
  const initials = getInitials(fullName)
  const joined = user?.created_at
    ? new Date(user.created_at).toDateString()
    : "—"
  const email = user?.email ?? "—"
  const currentStatus = mapStatusNumericToText(user?.status)
  const storeId = user?.store?.id ?? 0
  if (!userId) {
    return (
      <div className="w-full p-6">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm">Missing user id in the URL.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="rounded-lg border bg-white p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-20 w-full bg-gray-100 rounded" />
            <div className="h-64 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full p-6">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-red-600">
            Failed to load user
            {(error as any)?.data?.message
              ? `: ${(error as any).data.message}`
              : "."}
          </p>
          <div className="mt-3">
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className="w-full bg-white rounded-[12px] border flex flex-col gap-6 pt-9 px-9 pb-16">
        <div className="w-full flex justify-between py-1 rounded">
          <Link
            href="/admin/merchants"
            className="font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
          >
            <ArrowBack /> Go back
          </Link>

          <UserStatusButton
            userId={userId}
            currentStatus={currentStatus}
            onUpdated={refetch}
          />
        </div>

        <div className="w-full flex gap-4 items-center">
          <Avatar className="w-[100px] h-[100px]">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={`${fullName} picture`} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[#232323] font-figtree font-bold text-[24px]/[32px] -tracking-[2%]">
                {fullName}
              </h4>
            </div>

            <h4 className="font-figtree font-medium text-base/[120%] text-left tracking-normal text-[#525252]">
              Joined: <span className="font-bold">{joined}</span>
            </h4>

            <div className="w-fit flex gap-1 py-1 px-2 rounded-[54px] bg-[#F7F6FC]">
              <Location className="text-primary w-4 h-4" />
              <span className="font-figtree font-normal text-[14px]/[140%] tracking-normal text-[#232323]">
                {email}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-12">
          <MerchantDetailTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="w-full">
            {/* For a merchant, feed storeId to your OrdersTable */}
            {activeTab === "orders" && <OrdersTable userId={userId} />}
            {activeTab === "product" && (
              <Products merchantUserId={userId} currentStoreId={storeId} />
            )}
            {activeTab === "merchant" && (
              <UserInformation userId={userId} userType="merchant" />
            )}
            {activeTab === "transaction" && (
              <Transactions userType="merchant" userId={userId} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

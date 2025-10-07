"use client"

import Transactions from "@/app/(admin)/_components/transactions"
import { ArrowBack, Location } from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useGetSingleUserQuery, type ApiUser } from "@/lib/redux/api/users"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { OrdersTable } from "../../../_components/orders"
import DetailTabs, { type TabKey } from "./_components/tabs"
import { UserStatusButton } from "./_components/update-status"
import UserInformation from "@/app/(admin)/_components/info"

export default function UserDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("bio")

  // route can be /[userId] or /[id]
  const params = useParams<{ userId?: string; id?: string }>()
  const idParam = params?.userId ?? params?.id ?? ""
  const userId = Number(idParam)

  // pick which kind of user detail you are viewing
  // change to "rider" or "merchant" when used on their pages
  const userType: "user" | "rider" | "merchant" = "user"

  const {
    data: singleResp,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSingleUserQuery({ userType, id: userId }, { skip: !userId })

  // Unwrap: our API might return ApiUser directly or {status,message,data}
  const user: ApiUser | undefined = useMemo(() => {
    const r: any = singleResp
    if (!r) return undefined
    return r?.data ?? r
  }, [singleResp])

  const fullName = useMemo(() => {
    const first = user?.profile?.first_name ?? ""
    const last = user?.profile?.last_name ?? ""
    return (
      [first, last].filter(Boolean).join(" ") ||
      user?.email ||
      user?.phone ||
      "—"
    )
  }, [user])

  const joined = useMemo(
    () => (user?.created_at ? new Date(user.created_at).toDateString() : "—"),
    [user]
  )

  const email = user?.email ?? "—"
  const avatar =
    user?.profile?.profile_image ??
    (user as any)?.profile?.profile_picture ??
    "/images/riders/rider-4.jpg"

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
            href="/admin/users"
            className="font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
          >
            <ArrowBack /> Go back
          </Link>

          <UserStatusButton
            userId={userId}
            currentStatus={
              String(user?.status ?? 1) === "1"
                ? "active"
                : String(user?.status ?? 0) === "0"
                ? "inactive"
                : "suspended"
            }
            onUpdated={refetch}
          />
        </div>

        <div className="w-full flex gap-4 items-center">
          <Avatar className="w-[100px] h-[100px]">
            <AvatarImage src={avatar} alt={`${fullName} picture`} />
            <AvatarFallback>
              {(fullName || "US").slice(0, 2).toUpperCase()}
            </AvatarFallback>
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

        <div className="w-full flex flex-col gap-[48px]">
          <DetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="w-full">
            {activeTab === "bio" && (
              <UserInformation userType="user" userId={userId} />
            )}
            {activeTab === "orders" && <OrdersTable userId={userId} />}
            {activeTab === "transaction" && (
              <Transactions userType="user" userId={userId} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

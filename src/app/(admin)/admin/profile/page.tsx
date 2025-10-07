"use client"

import { Guard } from "@/components/auth/Guard"
import { ArrowBack, Location } from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetMyProfileQuery } from "@/lib/redux/api/account"
import Link from "next/link"
import { useState } from "react"
import { AdminActivityLogs } from "./_components/logs"
import AdminDetailTabs, { type TabKey } from "./_components/tabs"

export default function AdminsDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("log")

  // Logged-in account/profile
  const { data: profile, isLoading, isError, error } = useGetMyProfileQuery()

  // Only fetch roles/permissions when needed
  // const { data: rolesResp } = useGetRolesQuery(undefined, {
  // skip: activeTab !== "permission",
  // })
  // const allPermissions = (rolesResp as any)?.data?.permissions ?? []

  // Normalize profile shape (support different casing/keys)
  const admin = profile // returned directly by the hook

  const firstName =
    (admin as any)?.first_name ?? (admin as any)?.firstname ?? ""
  const lastName = (admin as any)?.last_name ?? (admin as any)?.lastname ?? ""
  const username = (admin as any)?.username ?? ""
  const email = (admin as any)?.email ?? ""
  const roleName =
    (admin as any)?.role?.name ??
    (admin as any)?.role?.code ??
    (admin as any)?.role_name ??
    "—"
  const joinedAt = (admin as any)?.joined_at

  // Name + avatar
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    username ||
    email?.split("@")?.[0] ||
    "—"
  // const avatarPath = (admin as any)?.avatar_url ?? (admin as any)?.photo ?? null
  // const avatarSrc = avatarPath
  //   ? getImageUrl(avatarPath)
  //   : "/images/riders/rider-4.jpg"

  // Logs (optional)
  const logs = (admin as any)?.activity_logs ?? []

  if (isLoading) {
    return (
      <Guard allow={["super-admin", "admin", "customer-support"]}>
        <div className="w-full p-6">
          <div className="rounded-lg border bg-white p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-100 rounded" />
              <div className="h-64 w-full bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </Guard>
    )
  }

  if (isError || !admin) {
    return (
      <Guard allow={["super-admin", "admin", "customer-support"]}>
        <div className="w-full p-6">
          <div className="rounded-lg border bg-white p-6">
            <p className="text-red-600">
              Failed to load your profile
              {(error as any)?.data?.message
                ? `: ${(error as any).data.message}`
                : "."}
            </p>
            <div className="mt-3 flex items-center gap-3"></div>
          </div>
        </div>
      </Guard>
    )
  }

  return (
    <Guard allow={["super-admin", "admin", "customer-support"]}>
      <div className="w-full flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-[12px] border flex flex-col gap-6 pt-9 px-9 pb-16">
          {/* Top bar */}
          <div className="w-full flex justify-between py-1 rounded">
            <Link
              href="/admin/administration"
              className="font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
            >
              <ArrowBack /> Go back
            </Link>
          </div>

          {/* Header info */}
          <div className="w-full flex gap-4 items-center">
            <Avatar className="w-[100px] h-[100px]">
              <AvatarImage src="/images/image-placeholder.svg" alt=" picture" />
              <AvatarFallback>
                {fullName?.slice(0, 2).toUpperCase() || "AD"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[#232323] font-figtree font-bold text-[24px]/[32px] -tracking-[2%]">
                  {fullName}
                </h4>
              </div>

              <h4 className="font-figtree font-medium text-base/[120%] text-left tracking-normal text-[#525252]">
                Role: <span className="font-bold">{roleName}</span>
              </h4>

              {joinedAt && (
                <h4 className="font-figtree font-medium text-base/[120%] text-left tracking-normal text-[#525252]">
                  Joined: <span className="font-bold">{joinedAt}</span>
                </h4>
              )}

              <div className="w-fit flex gap-1 py-1 px-2 rounded-[54px] bg-[#F7F6FC]">
                <Location className="text-primary w-4 h-4" />
                <span className="font-figtree font-normal text-[14px]/[140%] tracking-normal text-[#232323]">
                  {email || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs + content */}
          <div className="w-full flex flex-col gap-[48px]">
            <AdminDetailTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <div className="w-full">
              {activeTab === "log" && <AdminActivityLogs logs={logs} />}

              {/* <Permissions
                allPermissions={allPermissions}
                initialPermissionIds={initialPermissionIds}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </Guard>
  )
}

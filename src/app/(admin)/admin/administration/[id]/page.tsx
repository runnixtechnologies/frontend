// app/admin/members/[adminId]/page.tsx
"use client"

import { Guard } from "@/components/auth/Guard"
import { ArrowBack, Location } from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetSingleAdminQuery } from "@/lib/redux/api/admin"
import { useGetRolesQuery } from "@/lib/redux/api/utils"
import Link from "next/link"
import { use, useMemo, useState } from "react"
import { AdminActivityLogs } from "./_components/logs"
import Permissions from "./_components/permissions"
import { StatusDialog } from "./_components/status"
import AdminDetailTabs, { type TabKey } from "./_components/tabs"

export default function AdminsDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("log")
  const { id } = use(params)
  const admin_id = Number(id)

  // Single admin fetch
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchAdmin,
  } = useGetSingleAdminQuery(admin_id, { skip: !admin_id })

  // Fetch master permissions only when the permission tab is opened (perf)
  const { data: rolesResp } = useGetRolesQuery(undefined, {
    skip: activeTab !== "permission",
  })
  const allPermissions = (rolesResp as any)?.data?.permissions ?? []

  // Normalize initial permission IDs (handles both shapes id / permission_id)
  const initialPermissionIds: number[] = useMemo(() => {
    const list = data?.data?.permissions ?? []
    return list.map((p: any) =>
      typeof p?.permission_id === "number" ? p.permission_id : p?.id
    )
  }, [data?.data?.permissions])

  const admin = data?.data
  const fullName =
    [admin?.firstname, admin?.lastname].filter(Boolean).join(" ") ||
    admin?.username ||
    "—"
  const roleName = admin?.role?.name ?? admin?.role?.code ?? "—"
  const logs = admin?.activity_logs ?? []

  // Loading / Error (behind Guard)
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
  if (!admin_id || isError) {
    return (
      <Guard allow={["super-admin", "admin", "customer-support"]}>
        <div className="w-full p-6">
          <div className="rounded-lg border bg-white p-6">
            <p className="text-red-600">
              Failed to load admin details
              {(error as any)?.data?.message
                ? `: ${(error as any).data.message}`
                : "."}
            </p>
            <Link
              href="/admin/members"
              className="text-primary underline mt-3 inline-block"
            >
              Back to members
            </Link>
          </div>
        </div>
      </Guard>
    )
  }

  return (
    <Guard allow={["super-admin", "admin", "customer-support"]}>
      <div className="w-full flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-[12px] border flex flex-col gap-6 pt-9 px-9 pb-16">
          <div className="w-full flex justify-between py-1 rounded">
            <Link
              href="/admin/administration"
              className="font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
            >
              <ArrowBack /> Go back
            </Link>

            <div className="flex items-center gap-3">
              <StatusDialog
                adminId={admin!.id}
                currentStatus={(admin?.status ?? "active").toLowerCase()}
                onUpdated={refetchAdmin}
              />
            </div>
          </div>

          <div className="w-full flex gap-4 items-center">
            <Avatar className="w-[100px] h-[100px]">
              <AvatarImage
                src={admin?.photo || "/images/riders/rider-4.jpg"}
                alt="Admin picture"
              />
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

              {admin?.joined_at && (
                <h4 className="font-figtree font-medium text-base/[120%] text-left tracking-normal text-[#525252]">
                  Joined: <span className="font-bold">{admin.joined_at}</span>
                </h4>
              )}

              <div className="w-fit flex gap-1 py-1 px-2 rounded-[54px] bg-[#F7F6FC]">
                <Location className="text-primary w-4 h-4" />
                <span className="font-figtree font-normal text-[14px]/[140%] tracking-normal text-[#232323]">
                  {admin?.email}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-12">
            <AdminDetailTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <div className="w-full">
              {activeTab === "log" && <AdminActivityLogs logs={logs} />}

              {activeTab === "permission" && (
                <Permissions
                  allPermissions={allPermissions}
                  roleId={admin!.role.id}
                  adminId={admin!.id}
                  initialPermissionIds={initialPermissionIds}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Guard>
  )
}

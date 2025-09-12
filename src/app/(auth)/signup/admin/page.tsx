"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"
import { useAcceptInviteQuery } from "@/lib/redux/api/admin"
import CreateAccountForm from "./_components/CreateAccountForm"

export default function CreateAccountPage() {
  const router = useRouter()
  const search = useSearchParams()
  const refToken = search.get("ref") ?? ""

  const {
    data: inviteResp,
    isLoading,
    isError,
    error,
  } = useAcceptInviteQuery(
    { token: refToken },
    {
      skip: !refToken,
      refetchOnMountOrArgChange: true,
    }
  )

  // Backend success?
  const respOk = (inviteResp as any)?.status === "00"
  const payload = (inviteResp as any)?.data ?? {}

  // Prefer backend-provided token; fall back to URL ref
  const backendToken: string = payload?.token ?? ""

  // Normalize user fields
  const user = payload?.user ?? {}
  const invite = {
    firstname: user?.firstname ?? "",
    lastname: user?.lastname ?? "",
    email: user?.email ?? "",
    roleCode: (user?.role?.code ?? "admin") as
      | "super-admin"
      | "admin"
      | "customer-support",
  }

  if (!refToken) {
    return (
      <CenteredCard
        title="Invalid Invitation"
        message="This page requires an invite token. Please open the invitation link from your email."
        primary={{
          label: "Go to Login",
          onClick: () => router.push("/login/admin"),
        }}
      />
    )
  }

  if (isLoading) return <SkeletonCard />

  if (isError || !respOk) {
    const msg =
      getApiErrorMessage(error) ||
      (inviteResp as any)?.message ||
      "This invitation is invalid or has expired."
    return (
      <CenteredCard
        title="Invitation Error"
        message={msg}
        secondary={{ label: "Retry", onClick: () => router.refresh() }}
        primary={{
          label: "Go to Login",
          onClick: () => router.push("/login/admin"),
        }}
      />
    )
  }

  return (
    <CreateAccountForm
      token={backendToken}
      invite={invite}
      onSuccess={() => router.push("/login/admin")}
    />
  )
}

/* --- helpers --- */
function CenteredCard({
  title,
  message,
  primary,
  secondary,
}: {
  title: string
  message: string
  primary?: { label: string; onClick: () => void }
  secondary?: { label: string; onClick: () => void }
}) {
  return (
    <div className="w-full flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg border p-6">
        <h2 className="font-figtree text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        <div className="flex gap-2">
          {secondary && (
            <Button variant="outline" onClick={secondary.onClick}>
              {secondary.label}
            </Button>
          )}
          {primary && (
            <Button onClick={primary.onClick}>{primary.label}</Button>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="w-full flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg border p-6 space-y-3">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  )
}

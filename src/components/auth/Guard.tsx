"use client"

import { ReactNode, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"

type RoleCode =
  | "super-admin"
  | "admin"
  | "customer-support"
  | "merchant"
  | string

export function Guard({
  children,
  allow,
}: {
  children: ReactNode
  allow?: RoleCode | RoleCode[]
}) {
  const { isLoggedIn, user, ready } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const role = user?.role?.code?.toLowerCase()
  const allowList = Array.isArray(allow)
    ? allow.map((r) => r.toLowerCase())
    : allow
    ? [allow.toLowerCase()]
    : null
  const isAllowed = !allowList || (role && allowList.includes(role))

  useEffect(() => {
    if (!ready) return // wait until LS/Redux checked
    if (!isLoggedIn) {
      const isAdminPage = pathname?.startsWith("/admin")
      const loginUrl = isAdminPage ? "/login/admin" : "/login"
      router.replace(`${loginUrl}?next=${encodeURIComponent(pathname || "/")}`)
    } else if (!isAllowed) {
      router.replace("/403")
    }
  }, [ready, isLoggedIn, isAllowed, router, pathname])

  if (!ready) return null
  if (!isLoggedIn || !isAllowed) return null
  return <>{children}</>
}

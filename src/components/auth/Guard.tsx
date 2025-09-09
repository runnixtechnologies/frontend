// components/auth/Guard.tsx
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
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const role = user?.role?.code

  const allowList = Array.isArray(allow) ? allow : allow ? [allow] : null
  const isAllowed = !allowList || (role && allowList.includes(role))

  useEffect(() => {
    if (!isLoggedIn) {
      // Decide which login route
      const isAdminPage = pathname?.startsWith("/admin")
      const loginUrl = isAdminPage ? "/login/admin" : "/login"
      router.replace(`${loginUrl}?next=${encodeURIComponent(pathname || "/")}`)
    } else if (!isAllowed) {
      router.replace("/403")
    }
  }, [isLoggedIn, isAllowed, router, pathname])

  if (!isLoggedIn || !isAllowed) return null
  return <>{children}</>
}

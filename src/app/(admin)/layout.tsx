// app/admin/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import type React from "react"
import { DashboardLayout } from "./_components/dashboard-layout"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Administration",
  description: "Runnix admin dashboard",
}

const ALLOW = ["super-admin", "admin", "customer-support"] as const
type AllowedRole = (typeof ALLOW)[number]

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Next 15.2.4: cookies() is async here
  const cookieStore = await cookies()
  const token = cookieStore.get("auth:token")?.value
  const role = cookieStore.get("auth:role")?.value?.toLowerCase() as
    | AllowedRole
    | undefined

  // Not authenticated → admin login (no render)
  if (!token) {
    redirect(`/login/admin?next=${encodeURIComponent("/admin")}`)
  }

  // Authenticated but not allowed → 403 (no render)
  if (!role || !ALLOW.includes(role)) {
    redirect("/403")
  }

  return (
    <DashboardLayout>
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </DashboardLayout>
  )
}

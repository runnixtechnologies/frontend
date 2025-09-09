import type { Metadata } from "next"
import type React from "react"
import { DashboardLayout } from "./_components/dashboard-layout"

export const metadata: Metadata = {
  title: "Merchant",
  description: "Runnix merchant dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardLayout>{children}</DashboardLayout>
}

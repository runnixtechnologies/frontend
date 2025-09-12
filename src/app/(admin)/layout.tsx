import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import type React from "react"
import { DashboardLayout } from "./_components/dashboard-layout"

export const metadata: Metadata = {
  title: "Administration",
  description: "Runnix admin dashboard",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DashboardLayout>
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </DashboardLayout>
  )
}

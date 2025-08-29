import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Administration",
  description: "Runnix admin dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}

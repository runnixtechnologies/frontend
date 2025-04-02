import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ReduxProvider } from "@/lib/redux/provider"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import React from "react"
import "./globals.css"

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "One delivery at a time. | Runnix",
  description:
    "Runnix is your go-to platform for effortless deliveries, designed to bring merchants, agents, and customers together on one seamless experience. Whether you're managing a business, handling deliveries, or receiving orders, we make the process transparent, reliable, and fast.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} antialiased`}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </ReduxProvider>
        </React.Suspense>
      </body>
    </html>
  )
}

"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "./dashboard-layout"

interface MerchantsLayoutProps {
  children: React.ReactNode
}

const tabs = [
  { name: "All Merchants", href: "/merchants" },
  { name: "Pending", href: "/merchants/pending" },
  { name: "Rejected", href: "/merchants/rejected" },
  { name: "Suspended", href: "/merchants/suspended" },
]

export function MerchantsLayout({ children }: MerchantsLayoutProps) {
  const pathname = usePathname()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                  pathname === tab.href
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground"
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </DashboardLayout>
  )
}

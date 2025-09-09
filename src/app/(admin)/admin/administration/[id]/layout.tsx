import type { ReactNode } from "react"

export default function MerchantDetailLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* This is where you would include your sidebar navigation */}
      <div className="flex-1">{children}</div>
    </div>
  )
}

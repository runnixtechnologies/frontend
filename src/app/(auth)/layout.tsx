import AppLogo from "@/components/svgs/logo"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Authentication | Runnix",
  description: "Runnix authentication page",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col gap-6 justify-center items-center">
      <Link href="/landing">
        <AppLogo />
      </Link>

      {children}
    </div>
  )
}

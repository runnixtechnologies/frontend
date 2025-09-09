import AppLogo from "@/components/svgs/logo"
import { Metadata } from "next"
import Image from "next/image"
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
    <div className=" w-full min-h-screen bg-white">
      <div className="grid xl:items-stretch gap-8 grid-cols-1 xl:grid-cols-2">
        {/* Left side */}
        <div className="w-full hidden h-screen xl:flex flex-col justify-between relative overflow-hidden bg-[#F7F6FC] p-8 md:p-12">
          {/* Logo */}
          <div className="h-[48px] flex items-center gap-[10px]">
            <Link href="/landing">
              <AppLogo />
            </Link>
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-16">
            {/* Big orange circle */}
            <div className="pointer-events-none relative mt-12 h-[320px] w-[320px] md:h-[396px] md:w-[472.5px]">
              <Image
                src="/login-svg.svg"
                alt="login svg illustration"
                width={472.5}
                height={396}
                className="w-full h-full left-[54%] top-[18%]"
              />
            </div>

            {/* Welcome copy */}
            <div className="font-figtree flex flex-col gap-4">
              <h2 className="text-3xl font-bold font-[40px]/[100%] text-center tracking-normal text-[#232323] ">
                One delivery at a time
              </h2>
              <p className="font-normal text-[24px]/[120%] tracking-normal text-center text-[#7c7c7c]">
                Runnix - Bringing Delivery Where It Matters
              </p>
            </div>
          </div>
          <div />
        </div>

        <div className="w-full h-full flex flex-col gap-8  items-center justify-center pt-16">
          <div className="h-[48px] flex items-center gap-[10px] xl:hidden">
            <Link href="/landing">
              <AppLogo />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

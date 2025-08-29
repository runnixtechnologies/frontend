"use client"

import { ArrowBack } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WelcomeOnboard() {
  const router = useRouter()
  return (
    <div className="w-full flex flex-col min-h-[80vh]">
      <Link
        href="/signup"
        className="px-8 xl:px-20 font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
      >
        <ArrowBack /> Go back
      </Link>
      <div className="w-full flex justify-center items-center">
        <div className="bg-white dark:bg-[#161226] w-full lg:w-[500px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-4 xs:px-4 gap-4 xs:gap-[20px] sm:gap-6">
          <Image
            src="/shop.svg"
            alt="Shop image"
            width={352.71}
            height={248}
            quality={50}
            className="w-full h-full object-contain"
          />
          <div className="w-full flex flex-col gap-2 mb-[24px]">
            <span className="font-figtree text-[#232323] font-bold text-[40px]/[120%] -tracking-[2%] text-center">
              Welcome Onboard 🎉
            </span>
            <span className="font-figtree font-normal text-[16px]/[140%] tracking-normal text-[#525252] text-center">
              Continue to verify your account and setup your business profile
            </span>
          </div>

          <Button
            onClick={() => router.push("/")}
            className="w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] py-3 xs:py-4 px-4 xs:px-5 rounded-lg xs:rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-sm xs:text-base leading-[120%] -tracking-[2%] text-white"
          >
            Get Started Now <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

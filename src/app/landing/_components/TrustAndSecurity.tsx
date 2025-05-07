"use client"

import { BankIcon, OrderProtectionIcon, VerifiedIcon } from "@/components/svgs"
import GetStartedButton from "./GetStartedButton"

export default function TrustAndSecurity() {
  const data = [
    {
      id: 1,
      title: "Verified Drivers & Agents",
      description: "Background-checked and trusted.",
      img: VerifiedIcon,
    },
    {
      id: 2,
      title: "Order Protection",
      description: "If something goes wrong, we've got you covered.",
      img: OrderProtectionIcon,
    },
    {
      id: 3,
      title: "Secure Transactions",
      description: "Your payments and data are safe with us.",
      img: BankIcon,
    },
  ]
  return (
    <div className="w-full  min-h-[436px]  dark:bg-[#161226] bg-white/50 pt-0 pb-10 md:pt-16 lg:pt-[80px] lg:pb-[120px] flex justify-center items-center xl:px-[164px]">
      <div className="w-full max-w-[1200px] px-5 sm:px-6.5 md:px-8 lg:px-[44px] 2xl:px-[38px] 3xl:px-[24px] flex flex-col gap-6 md:gap-10 lg:gap-[64px]">
        <div className="w-full flex flex-col gap-[12px]">
          <h4 className="w-full font-figtree font-bold text-3xl md:text-4xl lg:text-[48px]/[44px] -tracking-[2%] dark:text-white text-black text-center">
            Trust & Security
          </h4>
          <p className="w-full font-inter font-normal text-[18px]/[140%] tracking-normal text-center text-[#656565] dark:text-white">
            We prioritize safety and reliability in every delivery
          </p>
        </div>
        <div className="w-full grid grid-cols-1 sm-md:grid-cols-2 xl:grid-cols-3 gap-8">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center xl:text-left gap-3"
            >
              {/* {item.img} */}
              <item.img className="w-20 h-20" />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg lg:text-xl font-bold font-figtree dark:text-white text-black text-center">
                  {item.title}
                </h3>
                <p className="text-sm dark:text-[#DCDCDC] text-[#626A62] w-[273px] text-center">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center items-center">
          <GetStartedButton buttonText="Get Started Now" link="/landing/sell" />
        </div>
      </div>
    </div>
  )
}

"use client"
import { RewardIcon, SocialLeaderboard, SwapIcon } from "@/components/svgs"
import Image from "next/image"
import GetStartedButton from "./GetStartedButton"

const data = [
  {
    id: 1,
    title: "Earn Points Per Use",
    description: "The more you use Runnix, the more you save.",
    icon: RewardIcon,
  },
  {
    id: 2,
    title: "Convert Points Anytime",
    description: "Use your points to cover delivery costs when needed.",
    icon: SwapIcon,
  },
  {
    id: 3,
    title: "Exclusive Rewards",
    description: "Get bonus points through promotions and referrals.",
    icon: SocialLeaderboard,
  },
]

export default function RewardSection() {
  return (
    <section className="w-full relative bg-[#FFF3ED] pt-12 pb-4 xl:py-20 px-4 sm:px-6 md:px-10 2xl:px-[128px] 3xl:px-[90px] flex justify-center items-center">
      <div className="w-full 2xl:w-[1200px] 3xl:w-[1350px] 4xl:w-[1400px] flex flex-col xl:flex-row justify-center items-center gap-6 xl:gap-[50px] 2xl:gap-[80px]">
        {/* Left Section - Slider */}
        <div
          className="w-full xl:w-1/2 max-w-[552px] flex flex-col gap-6 items-start text-left py-10"
          data-aos="zoom-in-up"
          data-aos-duration="800"
          data-aos-delay="200"
          data-aos-offset="200"
        >
          <div className="w-full flex flex-col gap-[36px] xl:py-12">
            <div className="w-full flex flex-col gap-3 text-left">
              <h1 className="font-figtree font-bold text-3xl 2xl:text-5xl leading-[120%] text-black -tracking-[2%]">
                Earn Points & Save on Deliveries
              </h1>
              <p className="text-sm lg:text-base md:text-lg xl:text-base 2xl:text-[20px] leading-[140%] text-[#626A62] tracking-normal max-w-[552px]">
                With Runnix, every time you use the app, you earn points! These
                points can be accumulated and redeemed as a delivery fee at any
                time.
              </p>
            </div>

            <div className="w-full flex flex-col gap-6">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col items-start gap-2"
                >
                  <h3 className="text-[#232323] text-base lg:text-lg xl:text-2xl leading-[120%] -tracking-[2%] font-bold font-figtree flex items-center gap-2">
                    <item.icon />
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-base text-[#656565]">
                    {item.description}
                  </p>
                </div>
              ))}
              <GetStartedButton buttonText="Start Ordering Now" link="/" />
            </div>
          </div>
        </div>
        {/* Right Section - Text */}
        <div
          className="w-full xl:w-1/2 h-[488px]"
          data-aos="fade-right"
          data-aos-duration="800"
          data-aos-delay="200"
          data-aos-offset="200"
        >
          <Image
            src="/images/reward-img.webp"
            alt="Earn a reward"
            fill
            quality={80}
          />
        </div>
      </div>
    </section>
  )
}

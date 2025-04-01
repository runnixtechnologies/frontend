"use client"
import dynamic from "next/dynamic"
import WaitListButton from "./WaitListButton"

const RunnixDeliveryRoute = dynamic(
  () => import("@/components/lottie/delivery-route"),
  {
    ssr: false,
  }
)

const DarkRunnixDeliveryRoute = dynamic(
  () => import("@/components/lottie/delivery-route/dark-mode-route"),
  {
    ssr: false,
  }
)
export default function HeroSection() {
  return (
    <section
      className="w-full min-h-[519px] relative xl:pt-10 pb-15"
      aria-label="Hero section"
    >
      <div className="relative z-10 w-full h-full px-4 xl:px-[128px]">
        <div className="w-full flex flex-col xl:flex-row items-center gap-[14px] xl:gap-[114px]">
          {/* Left Section - Text */}
          <div
            className="w-full xl:w-1/2 flex flex-col gap-[27px] justify-center items-center 2xl:justify-start 2xl:items-start relative"
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="100"
            data-aos-offset="200"
          >
            <div
              className="w-[120px] h-[120px] absolute md:left-[50%] left-[90%] top-10 inset-0 md:top-2 bg-no-repeat"
              style={{ backgroundImage: `url(/images/tree_1.svg)` }}
            />
            <div
              className="w-[120px] h-[120px] absolute -bottom-14 md:bottom-0 -left-10 md:-left-25 bg-no-repeat bg-center"
              style={{ backgroundImage: `url(/images/tree_2.svg)` }}
            />
            <div
              className="w-[120px] h-[120px] absolute bottom-0 right-0 sm-md:right-[20%] bg-no-repeat"
              style={{ backgroundImage: `url(/images/tree_3.svg)` }}
            />
            <div className="w-full flex flex-col gap-[36px] py-12">
              <span className="w-fit h-[44px] py-2 px-5 rounded-[24px] bg-[#E5E0F4] text-2xl leading-7 font-figtree font-semibold text-primary -tracking-[2%] text-center">
                One delivery at a time
              </span>
              <div className="w-full flex flex-col gap-4">
                <h1 className="text-left font-figtree font-bold fold:text-xl text-3xl lg:text-6xl xl:text-3xl 2xl:text-5xl leading-[120%] text-black dark:text-white -tracking-[2%]">
                  Runnix - Bringing Delivery Where It Matters
                </h1>
                <p className="text-left text-[17px] sm-md:text-lg xl:text-base 2xl:text-[20px] leading-[140%] font-figtree font-normal dark:text-[#DCDCDC] text-[#626A62]">
                  No working delivery service in your area? Runnix is here to
                  change that! We provide reliable, real-time tracked
                  deliveries, secure payments, and complete transparency for
                  individuals and businesses.
                </p>
              </div>
              <WaitListButton className="w-[169px]" />
            </div>
          </div>
          <div
            className="z-1 block dark:hidden"
            data-aos="fade-left"
            data-aos-duration="800"
            data-aos-delay="200"
            data-aos-offset="200"
          >
            <RunnixDeliveryRoute />
          </div>
          <div
            className="z-1 hidden dark:block"
            data-aos="fade-left"
            data-aos-duration="800"
            data-aos-delay="100"
            data-aos-offset="200"
          >
            <DarkRunnixDeliveryRoute />
          </div>
        </div>
      </div>
    </section>
  )
}

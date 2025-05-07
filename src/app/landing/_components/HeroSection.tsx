"use client"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

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
      <div className="relative z-10 w-ful h-full flex justify-center items-center px-4 lg:px-8 xl:px-10 2xl:px-[60px] 3xl:px-[118px]">
        <div className="w-full 2xl:w-[1200px] 3xl:w-[1350px] 4xl:w-[1400px]  flex flex-col xl:flex-row items-center justify-center gap-[14px] xl:gap-[114px]">
          {/* Left Section - Text */}
          <div
            className="w-full xl:w-[836.41px] flex flex-col gap-[27px] justify-center items-center 2xl:justify-start 2xl:items-start relative"
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="500"
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
              <span className="w-fit h-[44px] py-2 px-5 rounded-[24px] bg-[#E5E0F4] text-xl leading-7 font-figtree font-semibold text-primary -tracking-[2%] text-center">
                One delivery at a time
              </span>
              <div className="w-full flex flex-col gap-4">
                <h1 className="w-full text-left font-figtree font-extrabold fold:text-xl text-3xl lg:text-[56px] leading-[120%] text-black dark:text-white -tracking-[2%]">
                  Runnix - Bringing <br />
                  <span className="text-[#FC3813]">Delivery</span> Where It
                  Matters
                </h1>
                <p className="text-left text-[17px] sm-md:text-lg lg:text-[20px] leading-[140%] font-figtree font-normal dark:text-[#DCDCDC] text-[#525252] max-w-[556.41px]">
                  No working delivery service in your area? Runnix is here to
                  change that! We provide reliable, real-time tracked
                  deliveries, secure payments, and complete transparency for
                  individuals and businesses.
                </p>
              </div>
              <div className="w-full h-[48px] md:w-[318px] flex items-center gap-3">
                <Link href="/">
                  <Image
                    width={100}
                    height={100}
                    src="/google-store.svg"
                    alt="Goodle store app link"
                    className="w-auto h-auto"
                  />
                </Link>
                <Link href="/signup">
                  <Image
                    width={100}
                    height={100}
                    src="/apple-store.svg"
                    alt="Apple store app link"
                    className="w-auto h-auto"
                  />
                </Link>
              </div>
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

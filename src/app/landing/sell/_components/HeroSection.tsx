"use client"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section
      className="w-full dark:bg-[#161226] bg-white/50  min-h-[519px] relative xl:pt-10 pb-15"
      aria-label="Hero section"
    >
      <div className="relative z-10 w-full h-full flex justify-center items-center px-4 lg:px-8 2xl:px-0">
        <div className="w-full 2xl:w-[1200px] flex flex-col xl:flex-row items-center gap-[14px] justify-between">
          {/* Left Section - Text */}
          <div
            className="w-full xl:w-[836.41px] flex flex-col gap-[27px] justify-center items-center 2xl:justify-start 2xl:items-start relative"
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="500"
            data-aos-offset="200"
          >
            <div
              className="w-[120px] h-[120px] absolute md:left-[50%] left-[70%] top-10 inset-0 md:top-2 bg-no-repeat"
              style={{ backgroundImage: `url(/images/tree_2.svg)` }}
            />
            <div
              className="w-[120px] h-[120px] absolute fold:-bottom-18 sm:-bottom-14 md:bottom-0 fold:-left-0 sm:-left-10 md:-left-25 bg-no-repeat"
              style={{ backgroundImage: `url(/images/tree_3.svg)` }}
            />
            <div
              className="w-[120px] h-[120px] absolute -bottom-20 right-0  fold:left-[40%] sm:left-[50%] md:left-[60%] xl:left-[50%] sm-md:right-[20%] bg-no-repeat"
              style={{ backgroundImage: `url(/images/tree_1.svg)` }}
            />
            <div className="w-full flex flex-col gap-[36px] py-12">
              <span className="w-fit h-[44px] py-2 px-5 rounded-[24px] bg-[#FFE2D4] text-base lg:text-2xl leading-7 font-figtree font-semibold text-[#FC3813] -tracking-[2%] text-center">
                Runnix for Merchants
              </span>
              <div className="w-full flex flex-col gap-4">
                <h1 className="w-full text-left font-figtree font-extrabold fold:text-[32px] sm:text-[35px] md:text-[40px] lg:text-[56px] leading-[120%] text-black dark:text-white -tracking-[2%]">
                  Grow <span className="text-primary">Your Business</span>{" "}
                  <br /> with Seamless <br />
                  Deliveries.
                </h1>
                <p className="text-left text-[16px] sm-md:text-lg lg:text-[20px] leading-[140%] font-figtree font-normal dark:text-[#DCDCDC] text-[#525252] max-w-[556.41px]">
                  Join African businesses using Runnix to deliver goods, reach
                  more customers, and simplify operations. Download our app to
                  get started.
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
          <div className="w-full xl:w-[552px] h-full" data-aos="fade-left">
            <Image
              src="/images/merchant_hero.webp"
              alt="Runnix delivery service"
              width={552}
              height={496}
              quality={100}
              priority
              className="w-full 2xl:h-[525px] lg:w-[390px] h-[360px] xl:w-[552px] 2xl:w-[580px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

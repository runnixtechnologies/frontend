"use client"
import { Check } from "lucide-react"
import Image from "next/image"
import "swiper/css"
import "swiper/css/effect-fade"
import { A11y, Autoplay, EffectFade } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import GetStartedButton from "./GetStartedButton"

const images = [
  "/images/purpose-img_1.webp",
  "/images/purpose-img_2.webp",
  "/images/purpose-img_3.webp",
]
const data = [
  {
    id: 1,
    title: "Place an Order",
    description: "Select a local business or enter pickup/drop-off details.",
  },
  {
    id: 2,
    title: "Track Your Delivery",
    description: "Get real-time updates on your package's journey.",
  },
  {
    id: 3,
    title: "Receive with Confidence",
    description: "Verified agents ensure secure handovers.",
  },
]

export default function OurPurposeSection() {
  return (
    <section className="w-full min-h-[656px] relative dark:bg-[#161226] bg-white pt-12 pb-4 xl:py-20 px-4 sm:px-6 md:px-10 2xl:px-[128px] 3xl:px-[90px] flex justify-center items-center">
      <div className="w-full 2xl:w-[1200px] 3xl:w-[1350px] 4xl:w-[1400px] flex flex-col xl:flex-row justify-center items-center gap-6 xl:gap-[50px] 2xl:gap-[80px]">
        {/* Left Section - Slider */}
        <div
          className="w-full xl:w-[552px] h-[400px] lg:h-[500px] xl:h-[607px] rounded-3xl overflow-hidden"
          data-aos="fade-right"
          data-aos-duration="800"
          data-aos-delay="200"
          data-aos-offset="200"
        >
          <Swiper
            loop
            effect="fade"
            fadeEffect={{ crossFade: true }}
            slidesPerView={1}
            spaceBetween={0}
            modules={[Autoplay, EffectFade, A11y]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            className="w-full h-full"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={"img-" + idx} className="w-full h-full">
                <Image
                  src={img}
                  alt="Runnix delivery service"
                  width={552}
                  height={607}
                  quality={80}
                  className="w-full xl:w-[552px] h-[480px] xl:h-[607px] object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Section - Text */}
        <div
          className="w-full xl:w-1/2 max-w-[552px] flex flex-col gap-6 items-start text-left py-10"
          data-aos="zoom-in-up"
          data-aos-duration="800"
          data-aos-delay="200"
          data-aos-offset="200"
        >
          <div className="w-full flex flex-col gap-6 xl:py-12">
            <div className="w-full flex flex-col gap-4 text-left">
              <h1 className="font-figtree font-bold text-3xl 2xl:text-5xl leading-[120%] dark:text-white text-black">
                Built for Local Business
                <br /> and Small Enterprises!
              </h1>
              <p className="text-sm lg:text-base md:text-lg xl:text-base 2xl:text-[20px] leading-[140%] dark:text-[#DCDCDC] text-[#626A62] max-w-[552px]">
                Own a store, supermarket, restaurant, or any business? Runnix
                helps you reach more customers with fast, affordable deliveries.
              </p>
            </div>
            <div className="w-full grid grid-cols-1 gap-9">
              <div className="w-full flex flex-col gap-5">
                {data.map((item) => (
                  <div
                    key={item.id}
                    className="w-full flex flex-col items-start gap-2"
                  >
                    <h3 className="dark:text-white text-black text-base lg:text-lg xl:text-xl font-bold font-figtree flex items-center gap-2">
                      <span className="w-6 h-6  dark:bg-[#FF875C]/30 bg-primary/40 text-white rounded-full flex justify-center items-center">
                        <Check className="w-4 h-4 text-primary  dark:text-[#FF875C]" />
                      </span>
                      {item.title}
                    </h3>
                    <p className="text-sm lg:text-base dark:text-[#DCDCDC] text-[#656565]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
              <GetStartedButton
                buttonText="Become a Merchant"
                link="/landing/sell"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

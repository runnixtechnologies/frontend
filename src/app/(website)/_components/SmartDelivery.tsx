"use client"
import Image from "next/image"
import "swiper/css"
import "swiper/css/effect-fade"
import { A11y, Autoplay, EffectFade } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const images = [
  "/images/smart_delivery-img_1.webp",
  "/images/smart_delivery-img_2.webp",
  "/images/smart_delivery-img_3.webp",
]

export default function SmartDeliverySection() {
  return (
    <section className="w-full min-h-[656px] relative dark:bg-[#161226] bg-[#F7F6FC] pt-12 pb-4 xl:py-20 px-4 sm:px-6 md:px-10 xl:px-[128px]">
      <div className="w-full flex flex-col xl:flex-row items-center gap-6 xl:gap-[114px]">
        {/* Left Section - Slider */}
        <div
          className="w-full max-w-[552px] h-[320px] sm:h-[400px] md:h-[496px] rounded-3xl overflow-hidden"
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
                  fill
                  className="w-full h-full object-cover object-center rounded-[24px] bg-[#D9D9D9]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Section - Text */}
        <div
          className="w-full xl:w-1/2 flex flex-col gap-6 items-start text-left py-10"
          data-aos="zoom-in-up"
          data-aos-duration="800"
          data-aos-delay="200"
          data-aos-offset="200"
        >
          <span className="w-fit h-fit py-2 px-3  xl:px-5 rounded-[24px] bg-[#E5E0F4] text-sm sm:text-sm xl:text-lg leading-7 font-figtree font-semibold text-primary">
            Deliver smarter, track better, and pay securely
          </span>

          <h1 className="font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl leading-[120%] dark:text-white text-black">
            Deliveries That Work - <br className="hidden sm:inline" /> Anywhere
          </h1>

          <p className="text-sm md:text-base 2xl:text-[20px] leading-[140%] font-figtree dark:text-[#DCDCDC] text-[#626A62] max-w-[700px]">
            Runnix is your go-to platform for effortless deliveries, designed to
            bring merchants, agents, and customers together on one seamless
            experience. Whether you&apos;re managing a business, handling
            deliveries, or receiving orders, we make the process transparent,
            reliable, and fast.
          </p>
        </div>
      </div>
    </section>
  )
}

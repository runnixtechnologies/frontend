"use client"
import Image from "next/image"
import "swiper/css"
import "swiper/css/effect-fade"
import { A11y, Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

interface OfferProps {
  id: number
  title: string
  description: string
}

const data: OfferProps[] = [
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

const images: string[] = [
  "/images/how-it-works_img_1.webp",
  "/images/how-it-works_img_2.webp",
  "/images/how-it-works_img_3.webp",
  "/images/how-it-works_img_4.webp",
  "/images/how-it-works_img_5.webp",
]

export default function HowItWorksSection() {
  return (
    <section className="w-full relative dark:bg-[#161226] bg-[#F7F6FC] flex justify-center items-center py-10 lg:py-20 3xl:pb-30 px-4 2:px-0">
      <div
        className="w-full 2xl:w-[1200px] 3xl:w-[1350px] 4xl:w-[1400px] flex flex-col justify-center items-center gap-[48px]"
        data-aos="fade-up"
      >
        <div className="w-full flex flex-col gap-12">
          <h2 className="w-full text-center xl:text-left font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl leading-[44px]g dark:text-white text-black">
            How Runnix Works
          </h2>
          <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-6 xl:gap-[48px]">
            {data?.map((item) => (
              <div
                key={item.id}
                className="w-full md:w-[368px] flex flex-col items-start gap-3"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="dark:text-white text-black text-base sm:text-lg xl:text-xl font-bold font-figtree flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#FC3813] text-white rounded-full flex justify-center items-center">
                      {item.id}
                    </span>
                    {item.title}
                  </h3>
                  <p className="text-sm 3xl:text-base dark:text-[#DCDCDC] text-[#656565]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-full">
          <Swiper
            loop
            spaceBetween={16}
            slidesPerView={1}
            modules={[Autoplay, A11y]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
              },
              390: {
                slidesPerView: 1.15,
              },
              428: {
                slidesPerView: 1.5,
              },
              640: {
                slidesPerView: 1.5,
              },
              768: {
                slidesPerView: 2.2,
              },
              1024: {
                slidesPerView: 3.1,
              },
              1280: {
                slidesPerView: 3.5,
              },
              1440: {
                slidesPerView: 3.8,
              },
            }}
            className="w-full"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={"img-" + idx} className="w-full h-full">
                <Image
                  src={img}
                  alt="how it works pictures"
                  width={552}
                  height={496}
                  quality={80}
                  priority
                  className="w-[274.67px] sm:w-full  h-[320px] lg:h-[496px] xl:w-full xl:h-[428px] rounded-[24px] object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

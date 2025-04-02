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
    <section className="w-full min-h-[539px] relative dark:bg-[#161226] bg-[#F7F6FC] flex justify-center items-center py-16 sm:py-20 xl:pb-30">
      <div className="w-full flex flex-col gap-[48px]" data-aos="fade-up">
        <div className="w-full flex flex-col gap-12 items-center xl:items-start px-4 sm:px-6 md:px-8 2xl:px-20 3xl:px-30">
          <h2 className="w-full text-center xl:text-left font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl leading-snug dark:text-white text-black">
            How Runnix Works
          </h2>
          <div className="w-full 2xl:w-[1200px] 3xl:w-[1400px] flex flex-col lg:flex-row justify-between items-center gap-6 xl:gap-[48px]">
            {data?.map((item) => (
              <div
                key={item.id}
                className="w-[368px] flex flex-col items-start gap-3"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="dark:text-white text-black text-base sm:text-lg md:text-xl font-bold font-figtree flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#FC3813] text-white rounded-full flex justify-center items-center">
                      {item.id}
                    </span>
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-base dark:text-[#DCDCDC] text-[#656565]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full px-4 sm:px-6 md:pl-8 md:pr-0 xl:pl-20 3xl:pl-30 xl:pr-0">
          <div className="w-full h-auto">
            <Swiper
              loop
              spaceBetween={16}
              slidesPerView={1}
              modules={[Autoplay, A11y]}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              breakpoints={{
                320: {
                  slidesPerView: 1.1,
                },
                390: {
                  slidesPerView: 1.2,
                },
                428: {
                  slidesPerView: 1.3,
                },
                640: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 2.5,
                },
                1280: {
                  slidesPerView: 3,
                },
                1440: {
                  slidesPerView: 3.5,
                },
              }}
              className="w-full"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={"img-" + idx} className="w-full h-auto">
                  <Image
                    src={img}
                    alt="how it works pictures"
                    width={552}
                    height={496}
                    quality={80}
                    className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[496px] rounded-[24px] object-cover object-center"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}

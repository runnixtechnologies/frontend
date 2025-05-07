"use client"
import Image from "next/image"
import Link from "next/link"
import "swiper/css"
import "swiper/css/effect-fade"
import { A11y, Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

interface OfferProps {
  id: number
  title: string
  description: string
  img: string
}

const data: OfferProps[] = [
  {
    id: 1,
    title: "Manage your product inventory",
    description:
      "Add, edit, or remove items and categories. Update prices, descriptions, availability, and even upload product images.",
    img: "/images/phone_1.webp",
  },
  {
    id: 2,
    title: "Withdraw your earnings instantly",
    description:
      "Track your payout history, review transactions, and withdraw directly to your bank account whenever you want.",
    img: "/images/phone_2.webp",
  },
  {
    id: 3,
    title: "Handle orders in real-time",
    description:
      "View incoming orders, accept or reject requests, and mark items out of stock—all in just a few taps.",
    img: "/images/phone_3.webp",
  },
  {
    id: 4,
    title: "Track order progress live",
    description:
      "Monitor every stage of your deliveries—see when a rider picks up an item, starts the journey, and completes the drop-off.",
    img: "/images/phone_4.webp",
  },
  {
    id: 5,
    title: "View business insights",
    description:
      "Access daily, weekly, and monthly reports showing order trends, best-selling items, and revenue growth.",
    img: "/images/phone_5.webp",
  },
]

export default function UnlockGrowthSection() {
  return (
    <section className="w-full relative bg-[#FFE2D4] flex justify-center items-center py-10 lg:py-20 3xl:pb-30 px-4 2:px-0">
      <div
        className="w-full 2xl:w-[1200px] flex flex-col justify-center items-center gap-[48px]"
        data-aos="fade-up"
      >
        <div className="w-full flex flex-col gap-16">
          <div className="w-full flex flex-col lg-md:flex-row justify-between gap-6">
            <div className="w-full lg-md:w-[644px] flex flex-col gap-6">
              <h2 className="w-full text-left font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-[48px]/[120%] text-black">
                Unlock Growth with Runnix
              </h2>
              <p className="font-figtree font-normal text-[20px] lg:text-[24px] leading-[140%] text-[#525252] tracking-normal">
                Runnix helps you reduce delivery costs, increase customer
                satisfaction, and drive more repeat sales.
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
              <Link href="/">
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
                slidesPerView: 3,
                spaceBetween: 36,
              },
              1280: {
                slidesPerView: 3.2,
                spaceBetween: 36,
              },
              1440: {
                slidesPerView: 3.1,
                spaceBetween: 36,
              },
            }}
            className="w-full"
          >
            {data?.map((item, idx) => (
              <SwiperSlide
                key={"img-" + idx}
                className="w-full md:w-[368px] h-[368px] xl:h-[633px] flex-col"
              >
                <div className="w-full min-h-[134px] md:w-[368px] flex flex-col gap-3 mb-6">
                  <div className="w-full flex flex-col gap-2">
                    <Image
                      src="/splash.svg"
                      alt="spalsh icon"
                      width={29.44}
                      height={28}
                    />
                    <h3 className="w-full text-[#232323] text-base sm:text-lg xl:text-[24px]/[120%] -tracking-[2%] font-bold font-figtree flex items-center gap-2">
                      {item.title}
                    </h3>
                  </div>
                  <p className="w-full text-sm 3xl:text-[16px]/[120%] -tracking-[2%] text-[#656565]">
                    {item.description}
                  </p>
                </div>

                <Image
                  src={item.img}
                  alt="how it works pictures"
                  width={368}
                  height={755.51}
                  quality={100}
                  priority
                  className="w-[368px] h-[278px] xl:h-[499px]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

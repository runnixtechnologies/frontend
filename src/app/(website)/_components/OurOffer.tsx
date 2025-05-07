"use client"

import Image from "next/image"

interface OfferProps {
  id: number
  title: string
  description: string
  img: string
}

const offers: OfferProps[] = [
  {
    id: 1,
    title: "Real-time Tracking",
    description: "Know where your package is, always.",
    img: "/offer-img_1.svg",
  },
  {
    id: 2,
    title: "Local Business Support",
    description: "Helping businesses of all sizes deliver better.",
    img: "/offer-img_2.svg",
  },
  {
    id: 3,
    title: "Transparent Pricing",
    description: "No hidden fees, just fair rates.",
    img: "/offer-img_3.svg",
  },
  {
    id: 4,
    title: "Verified Agents",
    description: "Only trusted, vetted delivery personnel.",
    img: "/offer-img_4.svg",
  },
]

export default function OurOfferSection() {
  return (
    <section className="w-full min-h-[539px] relative dark:bg-[#1D192B] bg-white flex justify-center items-center px-4 sm:px-6 xl:px-0 py-16 sm:pt-20 sm:pb:30">
      <div
        className="w-full 2xl:w-[1200px] 3xl:w-[1350px] 4xl:w-[1400px] flex flex-col gap-12 items-center justify-center xl:items-start"
        data-aos="fade-up"
      >
        <h4 className="w-full text-center xl:text-left font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl leading-[44px]g dark:text-white text-black">
          What we Offer?
        </h4>

        <div className="w-full grid grid-cols-1 sm-md:grid-cols-2 xl:grid-cols-4 gap-8">
          {offers.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center xl:items-start text-center xl:text-left gap-3"
            >
              {/* {item.img} */}
              <Image
                src={item.img}
                alt="offer image"
                width={148}
                height={148}
                quality={80}
                className="w-[120px] h-[120px] xl:w-[148px] xl:h-[148px]"
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg lg:text-xl font-bold font-figtree dark:text-white text-black">
                  {item.title}
                </h3>
                <p className="text-sm lg:text-base dark:text-[#DCDCDC] text-[#626A62] max-w-[273px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

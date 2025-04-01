"use client"

import { OfferImage3, OfferImage4 } from "@/components/svgs/offer_imgs"
import { OfferImage1 } from "@/components/svgs/offer_imgs/offer_img-1"
import { OfferImage2 } from "@/components/svgs/offer_imgs/offer_img-2"
import Image from "next/image"

interface OfferProps {
  id: number
  title: string
  description: string
  img: React.ReactNode
}

const offers: OfferProps[] = [
  {
    id: 1,
    title: "Real-time Tracking",
    description: "Know where your package is, always.",
    img: <OfferImage1 />,
  },
  {
    id: 2,
    title: "Local Business Support",
    description: "Helping businesses of all sizes deliver better.",
    img: <OfferImage2 />,
  },
  {
    id: 3,
    title: "Transparent Pricing",
    description: "No hidden fees, just fair rates.",
    img: <OfferImage3 />,
  },
  {
    id: 4,
    title: "Verified Agents",
    description: "Only trusted, vetted delivery personnel.",
    img: <OfferImage4 />,
  },
]

export default function OurOfferSection() {
  return (
    <section className="w-full min-h-[539px] relative dark:bg-[#1D192B] bg-white flex justify-center items-center px-4 sm:px-6 md:px-10 xl:px-30 py-16 sm:pt-20 sm:pb:30">
      <div
        className="w-full max-w-[1200px] flex flex-col gap-12 items-center xl:items-start"
        data-aos="fade-up"
      >
        <h4 className="w-full text-center xl:text-left font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl leading-snug dark:text-white text-black">
          What we Offer?
        </h4>

        <div className="w-full grid grid-cols-1 sm-md:grid-cols-2 lg:grid-cols-4 gap-8">
          {offers.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center xl:items-start text-center xl:text-left gap-3"
            >
              {item.img}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-figtree dark:text-white text-black">
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

"use client"

import Image from "next/image"

interface whyRunnixProps {
  id: number
  title: string
  description: string
  img: string
}

const data: whyRunnixProps[] = [
  {
    id: 1,
    title: "Flexible Hours",
    description: "Work when it suits you",
    img: "/rider-why-runnix_1.svg",
  },
  {
    id: 2,
    title: "Instant Earnings",
    description: "Get paid per successful delivery.",
    img: "/rider-why-runnix_2.svg",
  },
  {
    id: 3,
    title: "Verified Requests",
    description: "Safe and secure delivery tasks only.",
    img: "/rider-why-runnix_3.svg",
  },
  {
    id: 4,
    title: "Support Always Available",
    description: "We've got your back in-app or online.",
    img: "/rider-why-runnix_4.svg",
  },
  {
    id: 5,
    title: "Join a Purpose-Driven Brand",
    description:
      "Be part of a service helping real people in real communities.",
    img: "/rider-why-runnix_5.svg",
  },
  {
    id: 6,
    title: "Boost Customer Loyalty",
    description:
      "Deliver on time, every time — and turn first-time buyers into repeat customers with consistent service.",
    img: "/rider-why-runnix_6.svg",
  },
]

export default function WhyRunnixSection() {
  return (
    <section className="w-full min-h-[539px] relative dark:bg-[#1D192B] bg-white/50 flex justify-center items-center px-4 sm:px-6 xl:px-0 py-16 sm:pt-20 lg:pb-30">
      <div
        className="w-full 2xl:w-[1200px] flex flex-col gap-12 items-center justify-center xl:items-start"
        data-aos="fade-up"
      >
        <h4 className="w-full text-center xl:text-left font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl leading-[44px]g dark:text-white text-black">
          Why Ride with Runnix?
        </h4>

        <div className="w-full grid grid-cols-1 sm-md:grid-cols-2 xl:grid-cols-3 gap-[36px]">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center xl:items-start text-center xl:text-left gap-3"
            >
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
                <p className="text-sm lg:text-base dark:text-[#DCDCDC] text-[#626A62] w-[273px]">
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

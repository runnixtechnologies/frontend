"use client"

import Image from "next/image"

interface OfferProps {
  id: number
  title: string
  description: string
  img: string
}

const data: OfferProps[] = [
  {
    id: 1,
    title: "Expand Your Customer Base",
    description:
      "Reach customers beyond your neighborhood — even in areas without reliable delivery infrastructure.",
    img: "/why-runnix_1.svg",
  },
  {
    id: 2,
    title: "Fast & Reliable Deliveries",
    description:
      "Get your products into customers' hands quickly with Runnix's network of verified delivery agents.",
    img: "/why-runnix_2.svg",
  },
  {
    id: 3,
    title: "Real-Time Order Tracking",
    description:
      "Give your customers peace of mind with live delivery updates and notifications from pickup to drop-off.",
    img: "/why-runnix_3.svg",
  },
  {
    id: 4,
    title: "Business Insights Dashboard",
    description:
      "Monitor sales, delivery performance, and customer activity from one easy-to-use dashboard.",
    img: "/why-runnix_4.svg",
  },
  {
    id: 5,
    title: "Seamless Digital Payments",
    description:
      "Accept secure, cashless payments and access simple settlement reports for hassle-free bookkeeping.",
    img: "/why-runnix_5.svg",
  },
  {
    id: 6,
    title: "Boost Customer Loyalty",
    description:
      "Deliver on time, every time — and turn first-time buyers into repeat customers with consistent service.",
    img: "/why-runnix_6.svg",
  },
]

export default function WhyRunnixSection() {
  return (
    <section className="w-full min-h-[539px] relative dark:bg-[#1D192B] bg-white/50 flex justify-center items-center px-4 sm:px-6 xl:px-0 py-16 sm:pt-20 lg:pb-30">
      <div
        className="w-full 2xl:w-[1200px] flex flex-col gap-12 justify-center items-start"
        data-aos="fade-up"
      >
        <h4 className="w-full text-left font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl leading-[44px]g dark:text-white text-black">
          Why Sell on Runnix?
        </h4>

        <div className="w-full grid grid-cols-1 sm-md:grid-cols-2 xl:grid-cols-3 gap-[36px]">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start text-left gap-3"
            >
              <Image
                src={item.img}
                alt="why sell on runnix image"
                width={96}
                height={96}
                quality={80}
                className="w-[72px] h-[72px] lg:w-[96px] lg:h-[96px]"
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg lg:text-xl font-bold font-figtree dark:text-white text-black">
                  {item.title}
                </h3>
                <p className="text-sm lg:text-base dark:text-[#DCDCDC] text-[#626A62] max-w-[376px]">
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

"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface roleProps {
  id: number
  title: string
  description: string
  img: string
  link: string
}

const roles: roleProps[] = [
  {
    id: 1,
    title: "Try the App",
    description:
      "Discover your favourite restaurants and vendors near you all in one place",
    img: "/try-app.svg",
    link: "",
  },
  {
    id: 2,
    title: "Become a Merchant",
    description:
      "Grow with Runnix! Boost sales and profit by partnering with us.",
    img: "/become-a-merchant.svg",
    link: "/landing/sell",
  },
  {
    id: 3,
    title: "Become a Rider",
    description: "Ride, deliver and earn. Earn more money riding with Runnix.",
    img: "/become-a-rider.svg",
    link: "/landing/rider",
  },
]

export default function RoleSection() {
  return (
    <section className="w-full min-h-[539px] relative dark:bg-[#1D192B] bg-white flex justify-center items-center px-4 sm:px-6 xl:px-0 py-16 sm:pt-20 sm:pb:30">
      <div
        className="w-full 2xl:w-[1200px] flex flex-col gap-12 items-center justify-center xl:items-start"
        data-aos="fade-up"
      >
        <div className="w-full grid grid-cols-1 sm-md:grid-cols-2 xl:grid-cols-3 gap-3">
          {roles.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="w-full md:w-[352px] h-[408px] flex flex-col items-center xl:items-start text-center gap-5"
            >
              <div className="w-full md:w-[300px] h-[275px]">
                <Image
                  src={item.img}
                  alt="list of role"
                  width={148}
                  height={148}
                  quality={80}
                  className="w-auto h-auto"
                />
              </div>
              <div className="w-full flex flex-col gap-2 border-b pb-5">
                <div className="w-full flex justify-between gap-5">
                  <h3 className="w-full md:w-[300px] text-left text-lg lg:text-[24px]/[32px] font-bold font-figtree dark:text-white text-black -tracking-[2%]">
                    {item.title}
                  </h3>
                  <ArrowRight className="text-black dark:text-white" />
                </div>
                <p className="w-full md:w-[300px] text-sm lg:text-/[120%] -tracking-[2%] dark:text-[#DCDCDC] text-[#626A62] max-w-[300px] text-left ">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

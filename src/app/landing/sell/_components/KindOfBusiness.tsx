"use client"

import Image from "next/image"

interface businessProps {
  id: number
  type: string
  img: string
}

const data: businessProps[] = [
  {
    id: 1,
    type: "Restaurants & Food Vendors",
    img: "/business-type_1.svg",
  },
  {
    id: 2,
    type: "Supermarkets & Convenience Stores",
    img: "/business-type_2.svg",
  },
  {
    id: 3,
    type: "Pharmacies & Health Stores",
    img: "/business-type_3.svg",
  },
  {
    id: 4,
    type: "Fashion Retailers",
    img: "/business-type_4.svg",
  },
  {
    id: 5,
    type: "Electronics & Gadget Stores",
    img: "/business-type_5.svg",
  },
  {
    id: 6,
    type: "Home & Living Stores",
    img: "/business-type_6.svg",
  },
  {
    id: 7,
    type: "Bookshops & Stationery Stores",
    img: "/business-type_7.svg",
  },
  {
    id: 8,
    type: "Pet Supplies Stores",
    img: "/business-type_8.svg",
  },
]

export default function BusinessesSection() {
  // Duplicate data for seamless loop
  const scrollingData = [...data, ...data]

  return (
    <section className="w-full relative dark:bg-[#161226] bg-white/50 py-16 sm:pt-20 overflow-hidden">
      <div className="flex flex-col gap-20 px-4 lg:px-20" data-aos="fade-up">
        <h4 className="w-full text-center font-figtree font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl dark:text-white text-black">
          Perfect for All Kinds of Businesses
        </h4>

        <div className="w-full overflow-hidden relative">
          <div className="flex animate-scroll gap-[36px] w-max">
            {scrollingData.map((item, index) => (
              <div
                key={index}
                className="h-[202px] flex flex-col items-center gap-3 w-[250.88px]"
              >
                <Image
                  src={item.img}
                  alt={item.type}
                  width={72}
                  height={72}
                  className="w-[72px] h-[72px] lg:w-[120px] lg:h-[120px]"
                />
                <h3 className="text-[24px]/[120%] text-center font-medium font-figtree dark:text-white text-black">
                  {item.type}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

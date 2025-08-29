import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import React from "react"

const foods = [
  {
    id: 1,
    name: "Jollof Rice + Beef",
    img: "/jollof-rice.png",
    price: "₦10,240",
    discount: "₦9,500",
    orders: 50,
  },
  {
    id: 2,
    name: "Jollof Rice + Beef",
    price: "₦5,120",
    discount: "₦4,500",
    img: "/white-rice.png",
    orders: 100,
  },

  {
    id: 3,
    name: "Jollof Rice + Beef",
    price: "₦10,240",
    discount: "₦8,500",
    img: "/white-rice.png",
    orders: 32,
  },
  {
    id: 4,
    name: "White Rice + Chiken",
    price: "₦5,120",
    discount: "₦4,500",
    img: "/white-rice.png",
    orders: 81,
  },
  {
    id: 5,
    name: "White Rice + Chiken",
    price: "₦5,120",
    discount: "₦4,500",
    img: "/white-rice.png",
    orders: 81,
  },
  {
    id: 6,
    name: "White Rice + Chiken",
    price: "₦5,120",
    discount: "₦2,500",
    img: "/white-rice.png",
    orders: 81,
  },
  {
    id: 7,
    name: "White Rice + Chiken",
    price: "₦5,120",
    discount: "₦3,900",
    img: "/white-rice.png",
    orders: 81,
  },
  {
    id: 8,
    name: "White Rice + Chiken",
    price: "₦5,120",
    discount: "₦4,400",
    img: "/white-rice.png",
    orders: 81,
  },
  {
    id: 9,
    name: "White Rice + Chiken",
    price: "₦5,120",
    discount: "₦4,500",
    img: "/white-rice.png",
    orders: 81,
  },
  {
    id: 10,
    name: "White Rice + Chiken",
    price: "₦8,120",
    discount: "₦7,500",
    img: "/white-rice.png",
    orders: 81,
  },
]
export default function Foods() {
  return (
    <div className="flex flex-col gap-8">
      <h4 className="font-figtree font-semibold text-[20px]/[120%] tracking-normal text-[#232323]">
        {foods?.length} Items
      </h4>
      <div className="flex flex-col gap-3">
        {foods?.map((item, index) => (
          <div
            key={index}
            className="flex gap-2 pb-2 border-b border-[#EFEFEF]"
          >
            <Checkbox />{" "}
            <div key={index} className="w-full flex items-start">
              <div className="mr-3">
                <div className="w-12 h-12 bg-amber-200 rounded-md overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full flex-grow">
                <p className="font-semibold font-figtree text-[16px]/[120%] tracking-normal text-[#232323]">
                  {item.name}
                </p>
                <p className="font-semibold font-figtree text-[14px]/[120%] tracking-normal text-[#525252]">
                  {item.orders} orders
                </p>
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-1">
                    <p className="text-[14px]/[120%] tracking-normal font-semibold font-figtree text-[#3D3D3D]">
                      {item.price}
                    </p>
                    <p className="text-[12px]/[120%] tracking-normal font-normal font-figtree text-[#989898] line-through">
                      {item.discount}
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

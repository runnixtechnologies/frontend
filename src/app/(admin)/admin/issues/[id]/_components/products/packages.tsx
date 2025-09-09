import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

const foods = [
  {
    id: 1,
    name: "Big pack",
    price: "₦10,240",
    discount: "₦4,500",
    orders: 50,
  },
  {
    id: 2,
    name: "Small pack",
    price: "₦5,120",
    discount: "₦2,500",
    orders: 100,
  },

  {
    id: 3,
    name: "Branded big  pack",
    price: "₦10,240",
    discount: "₦8,600",
    orders: 32,
  },
  {
    id: 4,
    name: "Branded Small Pack",
    price: "₦5,120",
    discount: "₦4,500",
    orders: 81,
  },
]
export default function Packages() {
  return (
    <div className="flex flex-col gap-8">
      <h4 className="font-figtree font-semibold text-[20px]/[120%] tracking-normal text-[#232323]">
        {foods?.length} Items
      </h4>
      <div className="flex flex-col gap-3">
        {foods?.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 pb-2 border-b border-[#EFEFEF]"
          >
            <Checkbox />{" "}
            <div key={index} className="w-full flex items-start">
              <div className="w-full flex-grow">
                <p className="font-bold font-figtree text-[16px]/[120%] tracking-normal text-[#232323]">
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

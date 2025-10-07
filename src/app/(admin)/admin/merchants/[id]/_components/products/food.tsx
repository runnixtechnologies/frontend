"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { useGetFoodsQuery, type Food } from "@/lib/redux/api/products"

type FoodsProps = {
  merchantUserId: number | string
  currentStoreId: number | string
  searchQuery: string
}

export default function Foods({
  merchantUserId,
  currentStoreId,
  searchQuery,
}: FoodsProps) {
  const { data, isLoading, isError } = useGetFoodsQuery({
    userid: merchantUserId,
    storeid: currentStoreId,
    search: searchQuery,
    status: "active",
  })

  const foods = data?.rows ?? []

  return (
    <div className="flex flex-col gap-8">
      <h4 className="font-figtree font-semibold text-[20px] text-[#232323]">
        {isLoading
          ? "Loading..."
          : isError
          ? "Failed to load"
          : `${foods.length} Items`}
      </h4>

      <div className="flex flex-col gap-3">
        {foods.map((item: Food) => (
          <div
            key={item.id}
            className="flex gap-2 pb-2 border-b border-[#EFEFEF]"
          >
            <Checkbox />
            <div className="w-full flex items-start">
              <div className="mr-3">
                <div className="w-12 h-12 bg-amber-200 rounded-md overflow-hidden">
                  <Image
                    src={item.photo || "/placeholder.svg"}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full flex-grow">
                <p className="font-semibold text-[16px] text-[#232323]">
                  {item.name}
                </p>
                <p className="font-semibold text-[14px] text-[#525252]">
                  {item.order_count ?? 0} orders
                </p>
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-1">
                    <p className="text-[14px] font-semibold text-[#3D3D3D]">
                      ₦{Number(item.price).toLocaleString("en-NG")}
                    </p>
                    {item.discount && Number(item.discount) > 0 && (
                      <p className="text-[12px] font-normal text-[#989898] line-through">
                        ₦{Number(item.discount).toLocaleString("en-NG")}
                      </p>
                    )}
                  </div>
                  <Switch defaultChecked={item.status === "active"} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && !isError && foods.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            No foods found.
          </p>
        )}
      </div>
    </div>
  )
}

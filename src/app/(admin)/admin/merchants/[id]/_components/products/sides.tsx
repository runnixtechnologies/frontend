"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useGetFoodSidesQuery } from "@/lib/redux/api/products"

type SidesProps = {
  merchantUserId: number | string
  currentStoreId: number | string
  searchQuery: string
}

export default function Sides({
  merchantUserId,
  currentStoreId,
  searchQuery,
}: SidesProps) {
  const { data, isLoading, isError, refetch } = useGetFoodSidesQuery({
    userid: merchantUserId,
    storeid: currentStoreId,
    search: searchQuery,
    status: "active",
  })

  if (isLoading) return <p>Loading sides…</p>
  if (isError)
    return (
      <p className="text-red-500">
        Failed to load sides. <button onClick={() => refetch()}>Retry</button>
      </p>
    )

  const sides = data?.rows ?? []

  return (
    <div className="flex flex-col gap-8">
      <h4 className="font-figtree font-semibold text-[20px]/[120%] text-[#232323]">
        {sides.length} Items
      </h4>

      <div className="flex flex-col gap-3">
        {sides.map((item) => (
          <div
            key={item.id}
            className="flex gap-2 pb-2 border-b border-[#EFEFEF]"
          >
            <Checkbox />
            <div className="w-full flex items-start">
              <div className="w-full flex-grow">
                <p className="font-semibold font-figtree text-[16px] text-[#232323]">
                  {item.name}
                </p>
                <p className="font-semibold font-figtree text-[14px] text-[#525252]">
                  {item.order_count} orders
                </p>
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-1">
                    <p className="text-[14px] font-semibold font-figtree text-[#3D3D3D]">
                      ₦{Number(item.price).toLocaleString("en-NG")}
                    </p>
                    {item.discount && Number(item.discount) > 0 && (
                      <p className="text-[12px] font-normal font-figtree text-[#989898] line-through">
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
      </div>
    </div>
  )
}

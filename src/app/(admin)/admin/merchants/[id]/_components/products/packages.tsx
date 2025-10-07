"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useGetPackagesQuery } from "@/lib/redux/api/products"

type PackagesProps = {
  merchantUserId: number | string
  currentStoreId: number | string
  searchQuery?: string
}

export default function Packages({
  merchantUserId,
  currentStoreId,
  searchQuery = "",
}: PackagesProps) {
  const { data, isLoading, isError, refetch } = useGetPackagesQuery({
    userid: merchantUserId,
    storeid: currentStoreId,
    status: "active",
    search: searchQuery,
  })

  if (isLoading) return <p>Loading packages…</p>
  if (isError)
    return (
      <p className="text-red-500">
        Failed to load packages.{" "}
        <button onClick={() => refetch()} className="underline text-primary">
          Retry
        </button>
      </p>
    )

  const packages = data?.rows ?? []

  return (
    <div className="flex flex-col gap-8">
      <h4 className="font-figtree font-semibold text-[20px]/[120%] text-[#232323]">
        {packages.length} Items
      </h4>

      <div className="flex flex-col gap-3">
        {packages.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 pb-2 border-b border-[#EFEFEF]"
          >
            <Checkbox />
            <div className="w-full flex items-start">
              <div className="w-full flex-grow">
                <p className="font-bold font-figtree text-[16px]/[120%] text-[#232323]">
                  {item.name}
                </p>
                {/* Show store name since order_count is missing */}
                <p className="font-semibold font-figtree text-[14px]/[120%] text-[#525252]">
                  {item?.store?.store_name ?? "—"}
                </p>
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-1">
                    <p className="text-[14px]/[120%] font-semibold font-figtree text-[#3D3D3D]">
                      ₦{Number(item.price).toLocaleString("en-NG")}
                    </p>
                    {item.discount && Number(item.discount) > 0 && (
                      <p className="text-[12px]/[120%] font-normal font-figtree text-[#989898] line-through">
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

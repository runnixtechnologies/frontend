import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { SearchCategory } from "../search/category"
import { CategoryData, Item } from "../types"
import { SearchItem } from "../search/items"
import { initialItems } from "../constants"

export type ItemFilterValues = {
  type: string
  location: string
  category: string
  status: string[]
  dateRange: string
  searchQuery: string
}

interface ItemFiltersProps {
  onFilterChange?: (filters: ItemFilterValues) => void
  data: CategoryData
}
export function Category({ data, onFilterChange }: ItemFiltersProps) {
  const [selectedItem, setSelectedItem] = useState("")
  const [filters, setFilters] = useState<ItemFilterValues>({
    type: "all-type",
    location: "all-locations",
    category: "",
    status: [],
    dateRange: "all-time",
    searchQuery: "",
  })
  const items: Item[] =
    initialItems?.filter((item) => item.category === selectedItem) || []

  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query }
    setFilters(newFilters)
    if (onFilterChange) onFilterChange(newFilters)
  }
  return (
    <div className="w-full p-6">
      <div className="w-full flex flex-col xl:flex-row gap-9">
        <div className="w-[280px] flex flex-col gap-4">
          <div className="w-[164px] flex items-center gap-2 rounded-xl">
            <Image
              src={data.icon}
              width={36}
              height={36}
              alt="supermarket icon"
            />{" "}
            <h3 className="text-[#232323] font-figtree font-bold text-[20px]/[120%] tracking-normal">
              {data.title}
            </h3>
          </div>
          <div className="w-full flex justify-between items-center">
            <Button
              variant="ghost"
              className="font-figtree font-semibold text-[14px]/[120%] -tracking-[2%] text-primary cursor-pointer"
            >
              Manage List
            </Button>
            <Button
              variant="ghost"
              className="font-figtree font-semibold text-[14px]/[120%] -tracking-[2%] text-primary flex gap-2 items-center cursor-pointer"
            >
              <PlusCircle /> New Listing
            </Button>
          </div>
          <SearchCategory onSearch={handleSearchChange} placeholder="Search" />
          <div className="w-full flex flex-col">
            {data?.categories?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedItem(item)}
                className={`h-[44px] rounded-[2px]  ${
                  selectedItem === item
                    ? "bg-[#F7F6FC] border-l-2 border-l-primary  border-b border-b-[#EFEFEF] pl-1"
                    : "bg-white border-b border-[#EFEFEF]"
                } font-figtree font-light texr-[14px]/[140%] -tracking-[2%] flex items-center cursor-pointer`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full border-l border-[#EFEFEF] py-3 px-9">
          {selectedItem && (
            <div className="w-full flex flex-col gap-[20px]">
              <div className="w-full flex justify-between items-center">
                <h3 className="text-[#232323] font-figtree font-bold text-[24px]/[120%] -tracking-[2%]">
                  {selectedItem}
                </h3>
                <Button className="cursor-pointer">Add New Item</Button>
              </div>
              <SearchItem onSearch={handleSearchChange} placeholder="Search" />
              {items?.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 bg-[#EFEFEF] h-[40px] rounded-xl py-2 px-3"
                    >
                      <Image
                        src={item.icon}
                        width={24}
                        height={24}
                        alt="item image"
                      />{" "}
                      <span className="font-figtree font-semibold text-[#232323] text-[14px]/[120%] tracking-normal">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex justify-center items-center mt-10">
                  {" "}
                  <span className="font-figtree font-semibold text-[#232323] text-[14px]/[120%] tracking-normal">
                    No items on this category
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

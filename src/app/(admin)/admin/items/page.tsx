"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getImageUrl } from "@/lib/cdn"
import { useGetAllStoreTypesQuery } from "@/lib/redux/api/storeType"
import { CirclePlus, Laptop, Search, Shirt, Sofa, Store } from "lucide-react"
import Image from "next/image"
import type { ElementType } from "react"
import { useEffect, useMemo, useState } from "react"
import { AddCategory } from "./_components/category/add"
import { CategoryDetails } from "./_components/category/details"
import { AddStoreType } from "./_components/store/add"
import { StoreDetails } from "./_components/store/details"

/* ---------- Types ---------- */
type StoreTypeLite = {
  id: number | string
  name: string
  description?: string | null
  image_url?: string | null
  status?: string | number
  categories?: Array<{ id: number | string; name: string; image_url?: string }>
}

type StoreTypeName = string
type Category = {
  id: number | string
  name: string
  icon?: string | null
}

/* ---------- Helpers ---------- */
function pickIconByName(name: string): ElementType {
  const n = name.toLowerCase()
  if (n.includes("market") || n.includes("super")) return Store
  if (n.includes("fashion") || n.includes("lifestyle")) return Shirt
  if (n.includes("gadget") || n.includes("it") || n.includes("tech"))
    return Laptop
  if (n.includes("furniture")) return Sofa
  return Store
}

/* ---------- Component ---------- */
export default function StorePage() {
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false)
  const [isCategoryDetailsDialogOpen, setIsCategoryDetailsDialogOpen] =
    useState(false)
  const [isNewStoreTypeDialogOpen, setIsNewStoreTypeDialogOpen] =
    useState(false)

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | string | null
  >(null)
  const [storeTypeSearch, setStoreTypeSearch] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [isStoreDetailsDialogOpen, setIsStoreDetailsDialogOpen] =
    useState(false)
  const { data, isLoading, isError, error, refetch } = useGetAllStoreTypesQuery(
    {
      status: "1",
      search: storeTypeSearch || undefined,
      page: 1,
      per_page: 100,
    }
  )

  const storeTypes = useMemo<StoreTypeLite[]>(() => data?.rows ?? [], [data])
  const storeTypeNames: StoreTypeName[] = useMemo(
    () => storeTypes.map((s) => s.name),
    [storeTypes]
  )
  const [selectedStoreType, setSelectedStoreType] = useState<StoreTypeName>("")

  useEffect(() => {
    if (!selectedStoreType && storeTypeNames.length > 0) {
      setSelectedStoreType(storeTypeNames[0])
    }
  }, [storeTypeNames, selectedStoreType])
  const filteredStoreTypes = useMemo(() => {
    const q = storeTypeSearch.toLowerCase()
    return storeTypeNames.filter((t) => t.toLowerCase().includes(q))
  }, [storeTypeNames, storeTypeSearch])

  // The selected store object
  const selectedStore = useMemo(
    () => storeTypes.find((s) => s.name === selectedStoreType),
    [storeTypes, selectedStoreType]
  )
  // Categories for the current store type (keep IDs!)
  const currentStoreCategories: Category[] = useMemo(() => {
    const cats = selectedStore?.categories ?? []
    return cats.map((c) => {
      return {
        id: c.id,
        name: c.name,
        icon: getImageUrl(c.image_url),
      }
    })
  }, [selectedStore])
  const filteredCategories = useMemo(() => {
    const q = categorySearch.toLowerCase()
    return currentStoreCategories.filter((c) =>
      c.name.toLowerCase().includes(q)
    )
  }, [currentStoreCategories, categorySearch])

  // Header icon: prefer store image, fallback to icon
  const headerIconSrc = getImageUrl(selectedStore?.image_url)
  const FallbackIcon = pickIconByName(selectedStoreType || "Store")

  return (
    <div className="flex min-h-screen p-4 md:p-6">
      <div className="w-full h-full flex bg-white p-6 gap-6">
        {/* Sidebar */}
        <div className="w-70 flex flex-col gap-4">
          <div className="flex h-6 items-center justify-between">
            <h1 className="font-figtree text-xl font-bold text-[#232323]">
              Store Types
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-transparent text-primary font-semibold text-sm"
              onClick={() => setIsNewStoreTypeDialogOpen(true)}
            >
              <CirclePlus className="w-4 h-4 mr-1" />
              New Type
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="h-[33px] pl-8"
              value={storeTypeSearch}
              onChange={(e) => setStoreTypeSearch(e.target.value)}
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="space-y-2">
              <div className="text-sm text-red-600">
                Failed to load store types{" "}
                {(error as any)?.data?.message
                  ? `: ${(error as any).data.message}`
                  : ""}
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="space-y-2">
              {filteredStoreTypes.length > 0 ? (
                filteredStoreTypes.map((type) => {
                  const isActive = selectedStoreType === type
                  return (
                    <div
                      key={type}
                      className={`h-11 flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${
                        isActive
                          ? "bg-[#F7F6FC] text-[#181719] border-l-2 border-primary font-semibold"
                          : "text-[#525252] hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedStoreType(type)}
                    >
                      {type}
                    </div>
                  )
                })
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  No store types found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main */}
        <div className="border-l border-[#EFEFEF] flex-1 p-9">
          <div className="max-w-6xl mx-auto flex flex-col gap-5">
            {/* Header */}
            <div className="h-9 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  {headerIconSrc ? (
                    <Image
                      src={headerIconSrc}
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  ) : (
                    <FallbackIcon className="w-5 h-5" />
                  )}
                </div>
                <button
                  className="font-figtree text-2xl font-bold text-[#232323] cursor-pointer"
                  onClick={() => {
                    if (selectedStore?.id) setIsStoreDetailsDialogOpen(true)
                  }}
                >
                  {selectedStoreType || "—"}
                </button>
              </div>
              <Button
                className="rounded-lg font-bold text-white px-3 py-2"
                onClick={() => setIsNewCategoryDialogOpen(true)}
                disabled={!selectedStoreType}
              >
                Add New Category
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="categories" className="w-full">
              <TabsContent value="categories">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search categories"
                    className="h-[43px] pl-10"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-2 p-3 bg-[#EFEFEF] rounded-lg cursor-pointer"
                        onClick={() => {
                          setSelectedCategoryId(category.id)
                          setIsCategoryDetailsDialogOpen(true)
                        }}
                      >
                        {typeof category.icon === "string" ? (
                          <Image
                            src={category.icon}
                            alt=""
                            width={30}
                            height={30}
                          />
                        ) : (
                          category.icon
                        )}
                        <span className="font-semibold text-base">
                          {category.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full col-span-full text-center py-12 text-gray-500">
                      No categories yet
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="inventory">
                <div className="text-center py-12 text-gray-500">
                  Inventory Management
                </div>
              </TabsContent>

              <TabsContent value="staff">
                <div className="text-center py-12 text-gray-500">
                  Staff Management
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Dialogs */}
        <AddCategory
          open={isNewCategoryDialogOpen}
          onOpenChange={setIsNewCategoryDialogOpen}
          storeTypeName={selectedStoreType || "—"}
          storeTypeId={selectedStore?.id}
        />

        {selectedCategoryId != null && (
          <CategoryDetails
            open={isCategoryDetailsDialogOpen}
            onOpenChange={(o) => {
              if (!o) setSelectedCategoryId(null)
              setIsCategoryDetailsDialogOpen(o)
            }}
            categoryId={selectedCategoryId}
            storeType={selectedStoreType}
            onSaved={() => refetch()}
            onDeleted={() => {
              setSelectedCategoryId(null)
              refetch()
            }}
          />
        )}

        <AddStoreType
          open={isNewStoreTypeDialogOpen}
          onOpenChange={setIsNewStoreTypeDialogOpen}
        />
        {selectedStore?.id && (
          <StoreDetails
            open={isStoreDetailsDialogOpen}
            onOpenChange={setIsStoreDetailsDialogOpen}
            storeTypeId={selectedStore.id}
            onSaved={() => refetch()}
            onDeleted={() => {
              setSelectedStoreType("") // clear selection
              refetch()
            }}
          />
        )}
      </div>
    </div>
  )
}

import { baseApi } from "./baseApi"

/* ---------- Shared ---------- */
export type ApiPaginated<T> = {
  status: string
  message: string
  data: {
    current_page: number
    data: T[]
    total: number
    per_page: number
    last_page: number
    next_page_url: string | null
    prev_page_url: string | null
  }
  errors: unknown[]
}

export type ProductsList<T> = {
  rows: T[]
  page: number
  lastPage: number
  total: number
}

type CommonArgs = {
  page?: number
  limit?: number
  search?: string
  status?: string
  merchantid?: number | string
  storeid?: number | string
  userid?: number | string
  date_from?: string
  date_to?: string
}

function compactParams(q?: Partial<CommonArgs> | void) {
  const src = q ?? {}
  const p: Record<string, string | number> = {}
  p.page = Number(src.page ?? 1)
  p.per_page = Number(src.limit ?? 10)
  if (src.search) p.search = src.search
  if (src.status) p.status = src.status
  if (src.userid !== undefined && src.userid !== "")
    p.userid = src.userid as any
  if (src.merchantid !== undefined && src.merchantid !== "")
    p.merchantid = src.merchantid as any
  if (src.storeid !== undefined && src.storeid !== "")
    p.storeid = src.storeid as any
  if (src.date_from) p.date_from = src.date_from
  if (src.date_to) p.date_to = src.date_to
  return p
}
function mapList<T>(res: ApiPaginated<T>): ProductsList<T> {
  return {
    rows: (res?.data?.data ?? []) as T[],
    page: res?.data?.current_page ?? 1,
    lastPage: res?.data?.last_page ?? 1,
    total: res?.data?.total ?? 0,
  }
}

/* ---------- Foods  ---------- */
export type Food = {
  id: number
  store_id: number
  category_id: number
  section_id: number | null
  user_id: number
  name: string
  price: string | number
  photo: string | null
  short_description?: string | null
  max_qty?: number | null
  status?: "active" | "inactive" | string | null
  deleted?: 0 | 1
  order_count?: number
  discount?: string | number | null
  percentage?: string | number | null
  created_at?: string
  updated_at?: string
  store?: {
    id: number
    user_id: number
    store_name: string
    biz_logo?: string | null
  } | null
  category?: { id: number; name: string } | null
}
export type GetFoodsArgs = CommonArgs

/* ---------- Food Sides ---------- */
export type FoodSide = {
  id: number
  store_id: number
  section_id: number | null
  name: string
  price: string | number
  discount_start_date: string | null
  discount_end_date: string | null
  status: "active" | "inactive" | string
  created_at?: string
  updated_at?: string
  discount?: string | number // absolute discount value
  percentage?: string | number // percentage discount
  order_count?: number
  store?: { id: number; user_id: number; store_name: string } | null
}
export type GetFoodSidesArgs = CommonArgs

/* ---------- Packages ---------- */
export type PackageItem = {
  id: number
  store_id: number
  name: string
  price: string | number
  discount_start_date: string
  discount_end_date: string
  status: "active" | "inactive" | string
  created_at?: string
  updated_at?: string
  discount?: string | number
  percentage?: string | number
  store?: { id: number; user_id: number; store_name: string } | null
}
export type GetPackagesArgs = CommonArgs

export const productsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getFoods: b.query<ProductsList<Food>, GetFoodsArgs | void>({
      query: (q = {}) => ({
        url: "/foods",
        method: "GET",
        params: compactParams(q),
      }),
      transformResponse: (res: ApiPaginated<Food>) => mapList<Food>(res),
      providesTags: (result) => [
        { type: "Products", id: "FOODS" },
        ...(result?.rows?.map((r) => ({
          type: "Products" as const,
          id: `F-${r.id}`,
        })) ?? []),
      ],
    }),

    getFoodSides: b.query<ProductsList<FoodSide>, GetFoodSidesArgs | void>({
      query: (q = {}) => ({
        url: "/food-sides",
        method: "GET",
        params: compactParams(q),
      }),
      transformResponse: (res: ApiPaginated<FoodSide>) =>
        mapList<FoodSide>(res),
      providesTags: (result) => [
        { type: "Products", id: "SIDES" },
        ...(result?.rows?.map((r) => ({
          type: "Products" as const,
          id: `S-${r.id}`,
        })) ?? []),
      ],
    }),

    getPackages: b.query<ProductsList<PackageItem>, GetPackagesArgs | void>({
      query: (q = {}) => ({
        url: "/packages",
        method: "GET",
        params: compactParams(q),
      }),
      transformResponse: (res: ApiPaginated<PackageItem>) =>
        mapList<PackageItem>(res),
      providesTags: (result) => [
        { type: "Products", id: "PACKAGES" },
        ...(result?.rows?.map((r) => ({
          type: "Products" as const,
          id: `P-${r.id}`,
        })) ?? []),
      ],
    }),
  }),
  overrideExisting: true,
})

export const { useGetFoodsQuery, useGetFoodSidesQuery, useGetPackagesQuery } =
  productsApi

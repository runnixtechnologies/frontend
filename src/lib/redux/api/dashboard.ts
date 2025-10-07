import { baseApi } from "./baseApi"

/** --------- Record counts (existing) --------- */
type RecordCountsApiResponse = {
  status: string
  message: string
  data: {
    revenue: string | number
    orders: string | number
    users: string | number
    merchants: string | number
    riders: string | number
  }
  errors: unknown[]
}

export type RecordCounts = {
  revenue: string
  orders: number
  users: number
  merchants: number
  riders: number
}

/** --------- New users (unchanged) --------- */
type ApiNewUser = {
  id: number
  phone: string | null
  email: string | null
  role: string | null
  created_at: string
  profile?: {
    first_name?: string | null
    last_name?: string | null
    profile_image?: string | null
  } | null
}
type ApiNewUsersResponse = {
  status: string
  message: string
  data: ApiNewUser[]
  errors: unknown[]
}

export type NewUser = {
  id: string
  name: string
  email: string
  createdAt: string
  profileImage?: string | null
}
export type NewUsers = NewUser[]

/** --------- Most ordered (unchanged) --------- */
type ApiMostOrdered = {
  item_id: number
  item_name: string
  total_quantity_ordered: string | number
  total_times_ordered: number
}
type ApiMostOrderedResponse = {
  status: string
  message: string
  data: ApiMostOrdered[]
  errors: unknown[]
}
export type MostOrderedItem = { id: string; name: string; count: number }[]

/** --------- Charts (unchanged) --------- */
export const CHART_TYPES = ["users", "merchant", "rider", "orders"] as const
export type ChartType = (typeof CHART_TYPES)[number]
type ChartCountsPoint = { date: string; total: number }
type ChartCountsEnvelope = {
  status: string
  message: string
  data: ChartCountsPoint[]
  errors: unknown[]
}

/** --------- Top performers (shared types) --------- */
type ApiTopPerformer = {
  id?: number
  user_id?: number
  email?: string | null
  phone?: string | null
  total?: number | string
  profile?: { first_name?: string | null; last_name?: string | null } | null
}
type ApiTopPerformersResponse = {
  status: string
  message: string
  data: ApiTopPerformer[]
  errors: unknown[]
}
export type TopPerformer = {
  id: string
  name: string
  emailOrPhone: string
  total: number
}
export type GetTopPerformersArgs = {
  date_from?: string
  date_to?: string
}

/** --------- Top orders buckets (shared) --------- */
type ApiTopOrderBucket = {
  key?: string
  location?: string
  name?: string
  device?: string
  total_orders?: number | string
}
type ApiTopOrdersResponse = {
  status: string
  message: string
  data: ApiTopOrderBucket[]
  errors: unknown[]
}
export type TopOrderBucket = { key: string; total: number }
export type GetTopOrdersArgs = {
  date_from?: string
  date_to?: string
}

/** --------- Helpers --------- */
const mapMoney = (n: unknown) =>
  `₦ ${Number(n ?? 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const mapTopPerformers = (res: ApiTopPerformersResponse): TopPerformer[] =>
  (res?.data ?? []).map((u) => {
    const first = u.profile?.first_name ?? ""
    const last = u.profile?.last_name ?? ""
    const name =
      [first, last].filter(Boolean).join(" ").trim() ||
      u.email ||
      u.phone ||
      `User #${u.id ?? u.user_id}`
    return {
      id: String(u.id ?? u.user_id ?? name),
      name,
      emailOrPhone: (u.email ?? u.phone ?? "") as string,
      total: Number(u.total ?? 0),
    }
  })

const mapTopOrders = (res: ApiTopOrdersResponse): TopOrderBucket[] =>
  (res?.data ?? []).map((b) => {
    return {
      key: String(b.location ?? b.name ?? b.device ?? "Unknown"),
      total: Number(b.total_orders ?? 0),
    }
  })

/** ===========================================
 *                API SLICE
 * =========================================== */
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /* --------- Record counts --------- */
    getRecordCounts: b.query<RecordCounts, void>({
      query: () => ({ url: "/dashboard-data/record-count" }),
      transformResponse: (res: RecordCountsApiResponse): RecordCounts => {
        const d = res?.data ?? ({} as RecordCountsApiResponse["data"])
        return {
          revenue: mapMoney(d.revenue),
          orders: Number(d.orders ?? 0),
          users: Number(d.users ?? 0),
          merchants: Number(d.merchants ?? 0),
          riders: Number(d.riders ?? 0),
        }
      },
      providesTags: [{ type: "Dashboard", id: "COUNTS" }],
    }),

    /* --------- New users --------- */
    getNewUsers: b.query<NewUsers, { role?: string; max?: number } | void>({
      query: (q) => ({
        url: "/dashboard-data/new-users",
        params: {
          role: q?.role ?? "merchant",
          max: q?.max ?? 4,
        },
      }),
      transformResponse: (res: ApiNewUsersResponse): NewUsers =>
        (res?.data ?? []).map((u) => {
          const first = u.profile?.first_name ?? ""
          const last = u.profile?.last_name ?? ""
          const name =
            [first, last].filter(Boolean).join(" ").trim() ||
            u.email ||
            `User #${u.id}`
          return {
            id: String(u.id),
            name,
            email: u.email ?? "",
            createdAt: u.created_at,
            profileImage: u.profile?.profile_image ?? null,
          }
        }),
      providesTags: [{ type: "Dashboard", id: "NEW_USERS" }, "Users"],
    }),

    /* --------- Most ordered items --------- */
    getMostOrderedItems: b.query<
      MostOrderedItem,
      { date_from?: string; date_to?: string } | void
    >({
      query: (q) => ({
        url: "/dashboard-data/most-ordered-items",
        params: { date_from: q?.date_from, date_to: q?.date_to },
      }),
      transformResponse: (res: ApiMostOrderedResponse): MostOrderedItem =>
        (res?.data ?? []).map((x) => ({
          id: String(x.item_id),
          name: x.item_name,
          count: Number(x.total_quantity_ordered ?? 0),
        })),
      providesTags: [{ type: "Dashboard", id: "MOST_ORDERED" }, "Orders"],
    }),

    /* --------- Chart counts --------- */
    getChartCounts: b.query<
      ChartCountsPoint[],
      {
        type: ChartType
        date_from?: string
        date_count?: number
        status?: string
      } | void
    >({
      query: (q) => ({
        url: "/dashboard-data/chart-counts",
        params: {
          type: q?.type,
          date_from: q?.date_from,
          date_count: q?.date_count,
          status: q?.status,
        },
      }),
      transformResponse: (res: ChartCountsEnvelope) => res?.data ?? [],
      providesTags: [{ type: "Dashboard", id: "CHART_COUNTS" }],
    }),

    /** ===============================
     *   NEW: Top performers (split)
     * =============================== */
    // 1) Top performing merchants
    getTopMerchants: b.query<TopPerformer[], GetTopPerformersArgs | void>({
      query: (q) => ({
        url: "/dashboard-data/top-merchants",
        params: { date_from: q?.date_from, date_to: q?.date_to },
      }),
      transformResponse: mapTopPerformers,
      providesTags: [{ type: "Dashboard", id: "TOP_MERCHANTS" }],
    }),

    // 2) Top performing riders
    getTopRiders: b.query<TopPerformer[], GetTopPerformersArgs | void>({
      query: (q) => ({
        url: "/dashboard-data/top-riders",
        params: { date_from: q?.date_from, date_to: q?.date_to },
      }),
      transformResponse: mapTopPerformers,
      providesTags: [{ type: "Dashboard", id: "TOP_RIDERS" }],
    }),

    /** ====================================
     *   NEW: Top orders by bucket (split)
     * ==================================== */
    // 3) Order by type
    getTopOrdersByType: b.query<TopOrderBucket[], GetTopOrdersArgs | void>({
      query: (q) => ({
        url: "/dashboard-data/top-orders-type",
        params: { date_from: q?.date_from, date_to: q?.date_to },
      }),
      transformResponse: mapTopOrders,
      providesTags: [{ type: "Dashboard", id: "TOP_ORDERS_TYPE" }, "Orders"],
    }),

    // 4) Order by location
    getTopOrdersByLocation: b.query<TopOrderBucket[], GetTopOrdersArgs | void>({
      query: (q) => ({
        url: "/dashboard-data/top-orders-location",
        params: { date_from: q?.date_from, date_to: q?.date_to },
      }),
      transformResponse: mapTopOrders,
      providesTags: [
        { type: "Dashboard", id: "TOP_ORDERS_LOCATION" },
        "Orders",
      ],
    }),

    // 5) Order by device
    getTopOrdersByDevice: b.query<TopOrderBucket[], GetTopOrdersArgs | void>({
      query: (q) => ({
        url: "/dashboard-data/top-orders-device",
        params: { date_from: q?.date_from, date_to: q?.date_to },
      }),
      transformResponse: mapTopOrders,
      providesTags: [{ type: "Dashboard", id: "TOP_ORDERS_DEVICE" }, "Orders"],
    }),
  }),
})

export const {
  useGetRecordCountsQuery,
  useGetNewUsersQuery,
  useGetMostOrderedItemsQuery,
  useGetChartCountsQuery,
  useGetTopMerchantsQuery,
  useGetTopRidersQuery,
  useGetTopOrdersByTypeQuery,
  useGetTopOrdersByLocationQuery,
  useGetTopOrdersByDeviceQuery,
} = dashboardApi

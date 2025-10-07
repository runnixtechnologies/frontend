import { baseApi } from "./baseApi"

export type ApiOrder = {
  id: number
  user_id: number
  rider_id: number
  store_id: number
  total_amount: string
  status:
    | "pending"
    | "completed"
    | "cancelled"
    | "in_transit"
    | "in-transit"
    | string
  payment_method: string
  payment_status: string
  delivery_address: string
  created_at: string
  updated_at: string
  items_count: number
  duration: number
  user?: { profile?: { first_name?: string | null; last_name?: string | null } }
  rider?: {
    profile?: { first_name?: string | null; last_name?: string | null }
  }
  store?: {
    id: number
    store_name: string
    biz_logo?: string | null
    status: string
  }
}

export type ApiOrdersResponse = {
  status: string
  message: string
  data: {
    current_page: number
    data: ApiOrder[]
    total: number
    per_page: number
    last_page: number
    next_page_url: string | null
    prev_page_url: string | null
  }
  errors: unknown[]
}

/* ----- UI row ----- */
export type OrderRow = {
  id: number
  date: string
  time: string
  user: string
  rider: string
  destination: string
  ends: string
  fee: string
  duration: string
  packs: number
  status: "in-transit" | "Pending" | "Completed" | "Cancelled"
}

/* ----- Query args (match backend names) ----- */
export type GetOrdersArgs = {
  page?: number
  limit?: number
  search?: string
  status?: string
  user_id?: number | string
  riderid?: number | string
  storeid?: number | string
  date_from?: string
  date_to?: string
}
export type GetOrderStatsResponse = {
  status: string // "00"
  message: string
  data: {
    pending_orders: number | null
    orders_in_transit: number | null
    canceled_orders: number | null
    completed_orders: number | null
  }
  errors: unknown[]
}

export type OrderStats = {
  pending: number
  inTransit: number
  cancelled: number
  completed: number
}

/* ----- Mapper: ApiOrder -> OrderRow ----- */
function toOrderRow(o: ApiOrder): OrderRow {
  const dt = new Date(o.created_at)
  const date = dt.toLocaleDateString()
  const time = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const statusMap: Record<string, OrderRow["status"]> = {
    completed: "Completed",
    cancelled: "Cancelled",
    in_transit: "in-transit",
    "in-transit": "in-transit",
    pending: "Pending",
  }
  const uiStatus = statusMap[o.status] ?? "Pending"

  const userName =
    [o.user?.profile?.first_name, o.user?.profile?.last_name]
      .filter(Boolean)
      .join(" ") || String(o.user_id)

  const riderName =
    [o.rider?.profile?.first_name, o.rider?.profile?.last_name]
      .filter(Boolean)
      .join(" ") || String(o.rider_id)

  return {
    id: o.id,
    date,
    time,
    user: userName,
    rider: riderName,
    destination: o.delivery_address,
    ends: "-", // no explicit end-time in sample
    fee: `₦ ${Number(o.total_amount ?? 0).toLocaleString("en-NG")}`,
    duration: String(o.duration ?? "-"),
    packs: Number(o.items_count ?? 0),
    status: uiStatus,
  }
}

/* ----- Helpers ----- */
function compactParams(
  q: GetOrdersArgs | void
): Record<string, string | number> {
  const p: Record<string, string | number> = {}

  // required-ish pagination defaults
  p.page = q?.page ?? 1
  p.per_page = q?.limit ?? 10

  // optional filters — only set if defined & non-empty
  if (q?.search) p.search = q.search
  if (q?.status) p.status = q.status
  if (q?.user_id !== undefined && q.user_id !== "") p.userid = q.user_id as any
  if (q?.riderid !== undefined && q.riderid !== "") p.riderid = q.riderid as any
  if (q?.storeid !== undefined && q.storeid !== "") p.storeid = q.storeid as any
  if (q?.date_from) p.date_from = q.date_from
  if (q?.date_to) p.date_to = q.date_to

  return p
}

/* ----- API slice ----- */
export const ordersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /* ---------- STATS ---------- */
    getOrderStats: b.query<OrderStats, { userId?: number | string } | void>({
      query: (arg) => {
        const userId = arg?.userId
        return {
          url: "/order-stats",
          method: "GET",
          params: userId ? { id: userId } : undefined,
        }
      },
      transformResponse: (res: GetOrderStatsResponse): OrderStats => ({
        pending: Number(res?.data?.pending_orders ?? 0),
        inTransit: Number(res?.data?.orders_in_transit ?? 0),
        cancelled: Number(res?.data?.canceled_orders ?? 0),
        completed: Number(res?.data?.completed_orders ?? 0),
      }),
      providesTags: [{ type: "Orders", id: "STATS" }],
    }),
    getAllOrders: b.query<
      { rows: OrderRow[]; page: number; lastPage: number; total: number },
      GetOrdersArgs | void
    >({
      query: (q) => ({
        url: "/orders",
        method: "GET",
        params: compactParams(q),
      }),
      transformResponse: (res: ApiOrdersResponse) => {
        const page = res?.data?.current_page ?? 1
        const lastPage = res?.data?.last_page ?? 1
        const total = res?.data?.total ?? 0
        const rows = (res?.data?.data ?? []).map(toOrderRow)
        return { rows, page, lastPage, total }
      },
      providesTags: (result) => [
        { type: "Orders", id: "LIST" },
        ...(result?.rows?.map((r) => ({ type: "Orders" as const, id: r.id })) ??
          []),
      ],
    }),
    getSingleOrder: b.query<ApiOrder, number | string>({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: (_res, _err, id) => [{ type: "Orders", id }],
    }),
  }),
})

export const {
  useGetOrderStatsQuery,
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
} = ordersApi

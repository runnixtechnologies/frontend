import { baseApi } from "./baseApi"

/* ---------- API payload ---------- */
export type ApiDelivery = {
  id: number
  package_number: string
  sender_id: number
  receiver_name: string
  receiver_phone: string
  receiver_address: string
  receiver_latitude: number | null
  receiver_longitude: number | null
  rider_id: number | null
  duration: number | null
  package_description: string | null
  package_value: string
  delivery_fee: string
  insurance_fee: string
  status: string
  payment_status: string
  pickup_instructions: string | null
  delivery_instructions: string | null
  created_at: string
  updated_at: string
  picked_up_at: string | null
  delivered_at: string | null
  sender?: {
    id: number
    phone: string
    email: string
    role: string
    is_verified: number
    status: number
    created_at: string
    updated_at: string
    profile?: {
      id: number
      user_id: number
      first_name: string | null
      last_name: string | null
      profile_image: string | null
    }
  }
  rider?: {
    id: number
    phone: string
    email: string
    role: string
    is_verified: number
    status: number
    created_at: string
    updated_at: string
    profile?: {
      id: number
      user_id: number
      first_name: string | null
      last_name: string | null
      profile_image: string | null
    }
  }
}

export type ApiDeliveriesResponse = {
  status: string
  message: string
  data: {
    current_page: number
    data: ApiDelivery[]
    total: number
    per_page: number
    last_page: number
    next_page_url: string | null
    prev_page_url: string | null
  }
  errors: unknown[]
}

/* ---------- UI row ---------- */
export type DeliveryRow = {
  id: number
  date: string
  time: string
  packageNumber: string
  user: string
  rider: string
  destination: string
  ends: string
  fee: string
  duration: string
  packs: number
  status: "in-transit" | "Pending" | "Completed" | "Cancelled"
}

/* ---------- Query/Mutation args ---------- */
export type GetDeliveriesArgs = {
  page?: number
  limit?: number
  search?: string
  status?: string
  storeid?: number | string
  riderid?: number | string
  package_number?: string
  delivered_at?: string
  date_from?: string
  date_to?: string
}

export type UpdateDeliveryStatusBody = {
  id: number | string
  status: string
}

export type DeleteDeliveryArg = number | string

/* ---------- mappers & helpers ---------- */
const statusToUi = (
  api: string,
  deliveredAt: string | null
): DeliveryRow["status"] => {
  const s = (api || "").toLowerCase()
  if (deliveredAt) return "Completed"
  if (s === "delivered" || s === "completed") return "Completed"
  if (s === "cancelled" || s === "canceled") return "Cancelled"
  if (s === "pending") return "Pending"
  if (
    ["accepted", "picked_up", "in_transit", "in-transit", "assigned"].includes(
      s
    )
  ) {
    return "in-transit"
  }
  return "Pending"
}

const toCurrency = (n: string | number | null | undefined) =>
  `₦ ${Number(n ?? 0).toLocaleString("en-NG")}`

function toRow(d: ApiDelivery): DeliveryRow {
  const dt = new Date(d.created_at)
  const date = dt.toLocaleDateString()
  const time = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const senderName =
    [d.sender?.profile?.first_name, d.sender?.profile?.last_name]
      .filter(Boolean)
      .join(" ") || String(d.sender_id)

  const riderName =
    [d.rider?.profile?.first_name, d.rider?.profile?.last_name]
      .filter(Boolean)
      .join(" ") || (d.rider_id != null ? String(d.rider_id) : "-")

  return {
    id: d.id,
    date,
    time,
    packageNumber: d.package_number,
    user: senderName,
    rider: riderName,
    destination: d.receiver_address,
    ends: "-",
    fee: toCurrency(d.delivery_fee),
    duration: String(d.duration ?? "-"),
    packs: 0,
    status: statusToUi(d.status, d.delivered_at),
  }
}

function compactParams(q?: GetDeliveriesArgs): Record<string, string | number> {
  const p: Record<string, string | number> = {
    page: q?.page ?? 1,
    per_page: q?.limit ?? 10,
  }
  if (q?.search) p.search = q.search
  if (q?.status) p.status = q.status
  if (q?.storeid !== undefined && q.storeid !== "") p.storeid = q.storeid as any
  if (q?.riderid !== undefined && q.riderid !== "") p.riderid = q.riderid as any
  if (q?.package_number) p.package_number = q.package_number
  if (q?.delivered_at) p.delivered_at = q.delivered_at
  if (q?.date_from) p.date_from = q.date_from
  if (q?.date_to) p.date_to = q.date_to
  return p
}

/* ---------- API slice ---------- */
/** Ensure baseApi.tagTypes includes "Deliveries" */
export const deliveriesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getAllDeliveries: b.query<
      { rows: DeliveryRow[]; page: number; lastPage: number; total: number },
      GetDeliveriesArgs | undefined
    >({
      query: (q) => ({
        url: "/package-deliveries",
        method: "GET",
        params: compactParams(q),
      }),
      transformResponse: (res: ApiDeliveriesResponse) => {
        const page = res?.data?.current_page ?? 1
        const lastPage = res?.data?.last_page ?? 1
        const total = res?.data?.total ?? 0
        const rows = (res?.data?.data ?? []).map(toRow)
        return { rows, page, lastPage, total }
      },
      providesTags: (result) => [
        { type: "Deliveries", id: "LIST" },
        ...(result?.rows?.map((r) => ({
          type: "Deliveries" as const,
          id: r.id,
        })) ?? []),
      ],
    }),
    getSingleDelivery: b.query<ApiDelivery, number | string>({
      query: (id) => ({ url: `/package-deliveries/${id}`, method: "GET" }),
      providesTags: (_res, _err, id) => [{ type: "Deliveries" as const, id }],
    }),

    updateDeliveryStatus: b.mutation<ApiDelivery, UpdateDeliveryStatusBody>({
      query: ({ id, status }) => ({
        url: `/package-deliveries/${id}`,
        method: "PATCH",
        body: { status },
      }),
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          deliveriesApi.util.updateQueryData(
            "getAllDeliveries",

            undefined,
            (draft) => {
              draft.rows.forEach((r) => {
                if (r.id === Number(id)) {
                  const s = String(status).toLowerCase()
                  r.status =
                    s === "delivered" || s === "completed"
                      ? "Completed"
                      : s === "cancelled" || s === "canceled"
                      ? "Cancelled"
                      : s === "pending"
                      ? "Pending"
                      : "in-transit"
                }
              })
            }
          )
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Deliveries", id },
        { type: "Deliveries", id: "LIST" },
      ],
    }),

    deleteDelivery: b.mutation<boolean, DeleteDeliveryArg>({
      query: (id) => ({
        url: `/package-deliveries/${id}`,
        method: "DELETE",
      }),
      transformResponse: (res: {
        status: string
        message: string
        data: boolean
      }) => Boolean(res?.data),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          deliveriesApi.util.updateQueryData(
            "getAllDeliveries",
            undefined,
            (draft) => {
              draft.rows = draft.rows.filter((r) => r.id !== Number(id))
              if (typeof draft.total === "number" && draft.total > 0) {
                draft.total -= 1
              }
            }
          )
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: (_res, _err, id) => [
        { type: "Deliveries", id },
        { type: "Deliveries", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetAllDeliveriesQuery,
  useGetSingleDeliveryQuery,
  useUpdateDeliveryStatusMutation,
  useDeleteDeliveryMutation,
} = deliveriesApi

import { toLocalUser } from "../users/toLocalUser"
import { baseApi } from "./baseApi"

/* ==================== Types (from your payload) ==================== */
// lib/redux/api/users.ts

export type MerchantCard = {
  id: number
  user_id: number
  card_brand: string | null
  last4: string | null
  authorization_code: string | null
  created_at: string
}

export type StoreLite = {
  id: number
  user_id: number
  store_name: string
  store_type_id: number
  biz_email: string | null
  biz_phone: string | null
  biz_address: string | null
  biz_reg_number: string | null
  biz_url: string | null
  biz_logo: string | null
  status: string // "0" | "1" etc.
  business_24_7: number
  created_at: string
  updated_at: string
}

export type ApiUser = {
  id: number
  phone?: string | null
  email?: string | null
  role: "user" | "rider" | "merchant" | string
  status?: number | string
  created_at?: string
  updated_at?: string

  // dashboard counters
  orders_count?: number | null
  loyal_users?: number | null
  profile_visits?: number | null
  revenue?: number | null
  rating?: number | null
  average_response_time?: number | null

  profile?: {
    id: number
    user_id: number
    first_name?: string | null
    last_name?: string | null
    gender?: string | null
    address?: string | null
    dob?: string | null
    profile_image?: string | null
    profile_picture?: string | null
  } | null

  wallet?: {
    id: number
    user_id: number
    balance: string
    currency?: string | null
    last_transaction_at?: string | null
    updated_at?: string
    // store_id, role etc. may appear on merchant payloads; keep it open:
    [k: string]: unknown
  } | null

  /* rider-only fields (may be absent for merchant) */
  schedules?: Array<{
    id: number
    rider_id: number
    day_of_week: string
    start_time: string
    end_time: string
    is_active: number
  }>
  documents?: Array<{
    id: number
    rider_id: number
    document_type: string
    document_name: string
    status: string
    verified_at: string | null
  }>
  availability?: {
    id: number
    rider_id: number
    is_online: number
    is_available: number
    current_status: "online" | "offline" | string
    latitude?: string | null
    longitude?: string | null
    address?: string | null
    battery_level?: number | null
  } | null
  rider?: {
    id: number
    user_id: number
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    email?: string | null
    profile_image?: string | null
    vehicle_type?: string | null
    license_plate?: string | null
    status?: string | null
    rating?: string | number | null
    total_orders?: number | null
    total_earnings?: string | number | null
  } | null
  vehicles?: Array<{
    id: number
    rider_id: number
    vehicle_type?: string | null
    license_plate?: string | null
    is_primary?: number
    is_active?: number
  }>

  /* merchant-only fields (the ones you’re missing) */
  store?: StoreLite | null
  merchant_cards?: MerchantCard[] | null
}
export type GetAllUsersResponse = {
  status: string // "00"
  message: string
  data: {
    current_page: number
    data: ApiUser[]
    total: number
    per_page: number
    last_page: number
    next_page_url: string | null
    prev_page_url: string | null
  }
  errors: unknown[]
}

export type User = {
  id: number
  name: string
  email: string
  phone: string
  gender: string
  status: "active" | "inactive" | "suspended"
  joined: string
  balance: string
}

export type GetUsersArgs = {
  status?: string
  is_verified?: boolean | 0 | 1
  search?: string
  page?: number
}

export type GetUserStatsResponse = {
  status: string
  message: string
  data: {
    active_users: string
    suspended_users: string
    inactive_users: string
    new_users: string
  }
  errors: unknown[]
}

export type UserStats = {
  active: number
  suspended: number
  inactive: number
  newlyAdded: number
}

/* ==================== Endpoints ==================== */
export const usersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /* ---------- STATS ---------- */
    getUserStats: b.query<
      UserStats,
      { userType: "user" | "rider" | "merchant" }
    >({
      query: ({ userType }) => ({
        url: "/user-stats",
        method: "GET",
        params: { "user-type": userType },
      }),
      transformResponse: (res: GetUserStatsResponse): UserStats => ({
        active: Number(res.data.active_users ?? 0),
        suspended: Number(res.data.suspended_users ?? 0),
        inactive: Number(res.data.inactive_users ?? 0),
        newlyAdded: Number(res.data.new_users ?? 0),
      }),
      providesTags: (_res, _err, arg) => [
        { type: "Users", id: `STATS-${arg.userType}` },
      ],
    }),

    /* ---------- LIST USERS ---------- */
    getAllUsers: b.query<User[], { userType: string } & GetUsersArgs>({
      query: ({ userType, ...args }) => {
        const p = new URLSearchParams()
        p.set("user-type", userType)
        if (args?.status) p.set("status", String(args.status))
        if (args?.search) p.set("search", String(args.search))
        if (typeof args?.is_verified !== "undefined") {
          const v = args.is_verified === true || args.is_verified === 1 ? 1 : 0
          p.set("is_verified", String(v))
        }
        if (args?.page) p.set("page", String(args.page))
        return { url: `/users${p.toString() ? `?${p}` : ""}`, method: "GET" }
      },
      transformResponse: (res: GetAllUsersResponse): User[] =>
        res.data.data.map(toLocalUser), // <— map API → page shape here
    }),

    /* ---------- SINGLE USER ---------- */
    getSingleUser: b.query<
      ApiUser,
      { userType: "user" | "rider" | "merchant"; id: number | string }
    >({
      query: ({ userType, id }) => ({
        url: `/users/${id}`,
        method: "GET",
        params: { "user-type": userType },
      }),
      providesTags: (_res, _err, arg) => [
        { type: "Users", id: `${arg.userType}-${arg.id}` },
      ],
      keepUnusedDataFor: 60,
    }),

    /* ---------- UPDATE STATUS ---------- */
    updateUserStatus: b.mutation<
      { status: string; message: string; data?: unknown },
      {
        userType: "user" | "rider" | "merchant"
        user_id: number | string
        status: "1" | "0" | "-1"
        remarks?: string
      }
    >({
      query: ({ userType, user_id, status, remarks }) => ({
        url: `/users/${user_id}/update-status`,
        method: "PUT",
        params: { "user-type": userType },
        body: { status, remarks: remarks ?? "" },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Users", id: `LIST-${arg.userType}` },
        { type: "Users", id: `${arg.userType}-${arg.user_id}` },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetUserStatsQuery,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserStatusMutation,
} = usersApi

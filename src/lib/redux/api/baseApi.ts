import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "@/lib/redux/store"

export const BASE_URL = "https://admin-api.runnix.africa/api/v1"

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const stateToken = (state?.Auth as any)?.token as string | null

      let token = stateToken
      if (!token && typeof window !== "undefined") {
        token =
          localStorage.getItem("auth:token") ||
          (() => {
            try {
              const u = localStorage.getItem("auth:user")
              return u ? JSON.parse(u)?.token ?? null : null
            } catch {
              return null
            }
          })()
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("content-type", "application/json")
      return headers
    },
  }),
  tagTypes: [
    "Auth",
    "Roles",
    "Admins",
    "StoreTypes",
    "Categories",
    "Pricing",
    "Users",
    "Orders",
    "Dashboard",
  ],
  endpoints: () => ({}),
})

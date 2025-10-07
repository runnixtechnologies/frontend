import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import type { RootState } from "@/lib/redux/store"

export const BASE_URL = "https://admin-api.runnix.africa/api/v1"

function getToken(getState: () => unknown) {
  const state = getState() as RootState
  const stateToken = (state as any)?.Auth?.token as string | null | undefined
  if (stateToken) return stateToken
  if (typeof window === "undefined") return null
  try {
    return (
      localStorage.getItem("auth:token") ||
      JSON.parse(localStorage.getItem("auth:user") || "null")?.token ||
      null
    )
  } catch {
    return null
  }
}

/** Base fetch that sets headers conditionally. */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, api) => {
    const token = getToken(api.getState)
    if (token) headers.set("Authorization", `Bearer ${token}`)
    headers.set("Accept", "application/json")
    return headers
  },
})

/** Wrapper to handle 401s (logout / redirect / refresh token flow). */
const baseQueryWithAuth = async (
  args: string | FetchArgs,
  api: any,
  extra: any
) => {
  // If we send JSON, set the content-type here (safer than global)
  if (
    typeof args === "object" &&
    args?.body &&
    !(args.body instanceof FormData)
  ) {
    args.headers = {
      ...(args.headers as any),
      "Content-Type": "application/json",
    }
  }
  const result = await rawBaseQuery(args, api, extra)
  if ((result.error as FetchBaseQueryError)?.status === 401) {
    // TODO: implement a refresh flow here if you have one, else clear auth:
    // api.dispatch(authLoggedOut())
    // Optionally: redirect user
  }
  return result
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
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
    "Deliveries",
    "Account",
    "Issues",
    "Riders",
    "Products",
    // "Settings",
  ],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 60,
  endpoints: () => ({}),
})

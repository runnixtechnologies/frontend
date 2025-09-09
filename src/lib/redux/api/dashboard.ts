import { baseApi } from "./baseApi"

export type RecordCounts = {
  users: number
  orders: number
  categories: number
  stores: number
}
export type NewUsers = {
  id: string
  name: string
  email: string
  createdAt: string
}[]
export type MostOrderedItem = { id: string; name: string; count: number }[]

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getRecordCounts: b.query<RecordCounts, void>({
      query: () => ({ url: "/dashboard/record-counts" }),
      providesTags: ["Dashboard"],
    }),
    getNewUsers: b.query<NewUsers, { limit?: number } | void>({
      query: (q) => ({ url: "/dashboard/new-users", params: q ?? {} }),
      providesTags: ["Dashboard", "Users"],
    }),
    getMostOrderedItems: b.query<MostOrderedItem, { limit?: number } | void>({
      query: (q) => ({ url: "/dashboard/most-ordered-items", params: q ?? {} }),
      providesTags: ["Dashboard", "Orders"],
    }),
  }),
})

export const {
  useGetRecordCountsQuery,
  useGetNewUsersQuery,
  useGetMostOrderedItemsQuery,
} = dashboardApi

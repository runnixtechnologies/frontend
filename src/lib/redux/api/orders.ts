import { baseApi } from "./baseApi"

export type Order = {
  id: string
  status: string
  total: number
  userId: string
}
export type UpdateOrderBody = { id: string; status: string }

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getOrders: b.query<Order[], { page?: number; limit?: number } | void>({
      query: (q) => ({ url: "/orders", params: q ?? {} }),
      providesTags: ["Orders"],
    }),
    getSingleOrder: b.query<Order, string>({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: ["Orders"],
    }),
    updateOrder: b.mutation<Order, UpdateOrderBody>({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
} = ordersApi

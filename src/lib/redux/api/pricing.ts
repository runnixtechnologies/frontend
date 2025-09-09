import { baseApi } from "./baseApi"

export type Pricing = {
  id: string
  name: string
  amount: number
  currency: string
}
export type CreatePricingBody = {
  name: string
  amount: number
  currency: string
}
export type UpdatePricingBody = {
  id: string
  name?: string
  amount?: number
  currency?: string
}

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    createPricing: b.mutation<Pricing, CreatePricingBody>({
      query: (body) => ({ url: "/pricing", method: "POST", body }),
      invalidatesTags: ["Pricing"],
    }),
    getAllPricing: b.query<Pricing[], void>({
      query: () => ({ url: "/pricing" }),
      providesTags: ["Pricing"],
    }),
    updatePricing: b.mutation<Pricing, UpdatePricingBody>({
      query: ({ id, ...body }) => ({
        url: `/pricing/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Pricing"],
    }),
    deletePricing: b.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/pricing/${id}`, method: "DELETE" }),
      invalidatesTags: ["Pricing"],
    }),
  }),
})

export const {
  useCreatePricingMutation,
  useGetAllPricingQuery,
  useUpdatePricingMutation,
  useDeletePricingMutation,
} = pricingApi

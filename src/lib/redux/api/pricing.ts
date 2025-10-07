import { baseApi } from "./baseApi"

/* ---- API payload ---- */
export type ApiPricing = {
  id: number
  option: string
  value: number
  type: "standard-delivery" | "express-delivery" | string
  is_flat: 0 | 1
  is_percentage: 0 | 1
  status: 0 | 1
  created_at: string
  updated_at: string
}

export type ApiPricingListResponse = {
  status: string
  message: string
  data: {
    current_page: number
    data: ApiPricing[]
    total: number
    per_page: number
    last_page: number
    next_page_url: string | null
    prev_page_url: string | null
  }
  errors: unknown[]
}

export type GetPricingArgs = {
  page?: number
  limit?: number
  type?: string // "express-delivery" | "standard-delivery"
  search?: string
  status?: 0 | 1
}

const compactParams = (q?: GetPricingArgs) => {
  const p: Record<string, string | number> = {
    page: q?.page ?? 1,
    per_page: q?.limit ?? 100,
  }
  if (q?.type) p.type = q.type
  if (q?.search) p.search = q.search
  if (q?.status !== undefined) p.status = q.status
  return p
}

export type CreatePricingBody = {
  option: string
  value: number
  type: "standard-delivery" | "express-delivery" | string
  is_flat: 0 | 1
  is_percentage: 0 | 1
  status: boolean
}
export type UpdatePricingBody = Partial<CreatePricingBody> & { id: number }

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getAllPricing: b.query<
      {
        items: ApiPricing[]
        page: number
        lastPage: number
        total: number
        perPage: number
      },
      GetPricingArgs | undefined
    >({
      query: (q) => ({
        url: "/pricing",
        method: "GET",
        params: compactParams(q),
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const q = queryArgs ?? ({} as GetPricingArgs)
        const norm: Record<string, any> = {}
        if (q.page != null) norm.page = q.page
        if (q.limit != null) norm.limit = q.limit
        if (q.type) norm.type = q.type
        if (q.search) norm.search = q.search
        if (q.status != null) norm.status = q.status
        return `${endpointName}|${JSON.stringify(norm)}`
      },
      transformResponse: (res: ApiPricingListResponse) => ({
        items: res?.data?.data ?? [],
        page: res?.data?.current_page ?? 1,
        lastPage: res?.data?.last_page ?? 1,
        total: res?.data?.total ?? 0,
        perPage: res?.data?.per_page ?? 0,
      }),
      providesTags: (result) => [
        { type: "Pricing" as const, id: "LIST" },
        ...(result?.items?.map((r) => ({
          type: "Pricing" as const,
          id: r.id,
        })) ?? []),
      ],
      keepUnusedDataFor: 60,
    }),
    createPricing: b.mutation<ApiPricing, CreatePricingBody>({
      query: (body) => ({ url: "/pricing", method: "POST", body }),
      invalidatesTags: [{ type: "Pricing", id: "LIST" }],
    }),

    updatePricing: b.mutation<ApiPricing, UpdatePricingBody>({
      query: ({ id, ...body }) => {
        return {
          url: `/pricing/${id}`,
          method: "PUT",
          body,
        }
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResults = dispatch(
          pricingApi.util.updateQueryData(
            "getAllPricing",
            undefined,
            (draft) => {
              const item = draft.items.find((i) => i.id === id)
              if (item) Object.assign(item, patch)
            }
          )
        )
        try {
          await queryFulfilled
        } catch {
          patchResults.undo()
        }
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Pricing", id },
        { type: "Pricing", id: "LIST" },
      ],
    }),
    deletePricing: b.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/pricing/${id}`, method: "DELETE" }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Pricing", id },
        { type: "Pricing", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetAllPricingQuery,
  useCreatePricingMutation,
  useUpdatePricingMutation,
  useDeletePricingMutation,
} = pricingApi

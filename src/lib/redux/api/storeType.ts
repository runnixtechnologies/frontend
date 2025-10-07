import { baseApi } from "./baseApi"

/* ---------- API types (from your payload) ---------- */
export type ApiCategory = {
  id: number
  name: string
  description: string | null
  store_type_id: number
  created_by: string | number | null
  created_at: string
  updated_at: string
  status: number
  image_url: string | null
}

export type ApiStoreType = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
  status?: string | number
  categories?: ApiCategory[]
}

type CreateStoreTypeArgs = {
  name: string
  description?: string
  image?: Blob | File | null
}

type CreateStoreTypeEnvelope = {
  status: string // "00"
  message: string // "Store type created"
  data: ApiStoreType
  errors: unknown[]
}
export type UpdateStoreTypeBody = {
  id: number | string
  name?: string
  description?: string | null
  /** if provided we send multipart/form-data */
  image?: File | null
  /** if no new file, we can still send old image_url */
  image_url?: string | null
}
export type GetAllStoreTypesApiResponse = {
  status: string
  message: string
  data: {
    current_page: number
    data: ApiStoreType[]
    total: number
    per_page: number
    last_page: number
    next_page_url: string | null
    prev_page_url: string | null
  }
  errors: unknown[]
}

export type GetStoreTypesArgs = {
  status?: "1" | "0"
  search?: string
  page?: number
  per_page?: number
}

/** Normalized list shape for UI */
export type StoreTypeLite = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  status: "active" | "inactive"
  categories: { id: number; name: string }[]
}

/* ---------- mappers ---------- */
function toLite(s: ApiStoreType): StoreTypeLite {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    image_url: s.image_url,
    status: String(s.status) === "1" ? "active" : "inactive",
    categories: (s.categories ?? []).map((c) => ({
      id: Number(c.id),
      name: c.name,
      image_url: c.image_url,
    })),
  }
}

/* ---------- slice ---------- */
export const storeTypeApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getAllStoreTypes: b.query<
      { rows: StoreTypeLite[]; total: number; page: number; lastPage: number },
      GetStoreTypesArgs | void
    >({
      query: (args) => {
        const p = new URLSearchParams()
        if (args?.status) p.set("status", args.status)
        if (args?.search) p.set("search", args.search)
        if (args?.page) p.set("page", String(args.page))
        if (args?.per_page) p.set("per_page", String(args.per_page))
        const qs = p.toString()
        return { url: `/store-types${qs ? `?${qs}` : ""}`, method: "GET" }
      },
      transformResponse: (res: GetAllStoreTypesApiResponse) => {
        const page = res?.data?.current_page ?? 1
        const lastPage = res?.data?.last_page ?? 1
        const total = res?.data?.total ?? 0
        const rows = (res?.data?.data ?? []).map(toLite)
        return { rows, total, page, lastPage }
      },
      providesTags: (result) => [
        { type: "StoreTypes", id: "LIST" },
        ...(result?.rows?.map((r) => ({
          type: "StoreTypes" as const,
          id: r.id,
        })) ?? []),
      ],
    }),

    /* CREATE: POST /store-types (multipart/form-data) */
    createStoreType: b.mutation<ApiStoreType, CreateStoreTypeArgs>({
      query: ({ name, description, image }) => {
        const form = new FormData()
        form.append("name", name)
        if (description) form.append("description", description)
        if (image) form.append("image", image) // swap to "image_url" if backend expects that field name
        return {
          url: "/store-types",
          method: "POST",
          body: form,
        }
      },
      transformResponse: (res: CreateStoreTypeEnvelope) => res.data,
      invalidatesTags: [{ type: "StoreTypes", id: "LIST" }],
    }),

    /* READ ONE: GET /store-types/:id */
    getSingleStoreType: b.query<StoreTypeLite, number | string>({
      query: (id) => ({ url: `/store-types/${id}`, method: "GET" }),
      transformResponse: (res: { data: ApiStoreType }) => toLite(res.data),
      providesTags: (_res, _err, id) => [{ type: "StoreTypes", id }],
    }),

    //  UPDATE
    updateStoreType: b.mutation<StoreTypeLite, UpdateStoreTypeBody>({
      query: ({ id, name, description, image, image_url }) => {
        // If a new file is present => send FormData (multipart)
        if (image instanceof File) {
          const form = new FormData()
          if (name !== undefined) form.append("name", name)
          if (description !== undefined)
            form.append("description", description ?? "")
          form.append("image", image) // field name your backend expects
          return { url: `/store-types/${id}`, method: "POST", body: form }
          // If your backend expects PUT for update with form-data, swap method to "PUT"
        }

        // Otherwise JSON update (no new file)
        return {
          url: `/store-types/${id}`,
          method: "PUT",
          body: { name, description, image_url: image_url ?? null },
        }
      },
      transformResponse: (res: { data: ApiStoreType }) => toLite(res.data),
      invalidatesTags: (_r, _e, arg) => [
        { type: "StoreTypes", id: "LIST" },
        { type: "StoreTypes", id: arg.id },
      ],
    }),
    /* UPDATE STATUS: PUT /store-types/:id/status */
    updateStoreTypeStatus: b.mutation<
      { success: boolean },
      { id: number | string; status: "1" | "0" }
    >({
      query: ({ id, status }) => ({
        url: `/store-types/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "StoreTypes", id: "LIST" },
        { type: "StoreTypes", id: arg.id },
      ],
    }),

    /* DELETE: DELETE /store-types/:id */
    deleteStoreType: b.mutation<{ success: boolean }, number | string>({
      query: (id) => ({ url: `/store-types/${id}`, method: "DELETE" }),
      invalidatesTags: (_res, _err, id) => [
        { type: "StoreTypes", id: "LIST" },
        { type: "StoreTypes", id },
      ],
    }),
  }),
})

export const {
  useCreateStoreTypeMutation,
  useGetAllStoreTypesQuery,
  useGetSingleStoreTypeQuery,
  useUpdateStoreTypeMutation,
  useUpdateStoreTypeStatusMutation,
  useDeleteStoreTypeMutation,
} = storeTypeApi

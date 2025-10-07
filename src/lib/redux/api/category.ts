import { baseApi } from "./baseApi"

/* ---------- API shapes ---------- */
export type ApiCategory = {
  id: number | string
  name: string
  description: string | null
  store_type_id: number | string
  status?: number | "0" | "1"
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

/* Minimal UI shape */
export type Category = {
  id: string
  name: string
  status: "active" | "inactive"
}

/* Bodies */
export type CreateCategoryBody = {
  name: string
  description?: string
  image?: File | null
  store_type_id: number | string
}

export type UpdateCategoryBody = {
  id: string | number
  name?: string
  image?: string
  description?: string
}

export type UpdateCategoryStatusBody = {
  id: string | number
  /** "active" | "inactive" for the UI; we'll convert to 1/0 for the backend */
  status: "active" | "inactive"
}

type Envelope<T> = {
  status?: string
  message?: string
  data?: T
  errors?: unknown[]
}

function toCategory(c: ApiCategory): Category {
  const raw = c.status
  const on =
    String(raw ?? "1") === "1" ||
    String(raw ?? "active").toLowerCase() === "active"
  return { id: String(c.id), name: c.name, status: on ? "active" : "inactive" }
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    createCategory: b.mutation<Category, CreateCategoryBody>({
      query: ({ name, description, image, store_type_id }) => {
        const form = new FormData()
        form.append("name", name)
        if (description) form.append("description", description)
        if (image) form.append("image", image)
        form.append("store_type_id", String(store_type_id))
        return { url: "/categories", method: "POST", body: form }
      },
      transformResponse: (res: Envelope<ApiCategory> | ApiCategory) =>
        toCategory(
          (res as Envelope<ApiCategory>)?.data ?? (res as ApiCategory)
        ),
      invalidatesTags: [
        { type: "Categories", id: "LIST" },
        { type: "StoreTypes", id: "LIST" },
      ],
    }),

    getAllCategories: b.query<Category[], void>({
      query: () => ({ url: "/categories", method: "GET" }),
      transformResponse: (res: Envelope<ApiCategory[]> | ApiCategory[]) => {
        const arr =
          (res as Envelope<ApiCategory[]>)?.data ?? (res as ApiCategory[]) ?? []
        return arr.map(toCategory)
      },
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),

    getSingleCategory: b.query<Category, string | number>({
      query: (id) => ({ url: `/categories/${id}`, method: "GET" }),
      transformResponse: (res: Envelope<ApiCategory> | ApiCategory) =>
        toCategory(
          (res as Envelope<ApiCategory>)?.data ?? (res as ApiCategory)
        ),
      providesTags: (_r, _e, id) => [{ type: "Categories", id }],
    }),
    updateCategory: b.mutation<Category, UpdateCategoryBody>({
      query: ({ id, name, description, image }) => {
        const form = new FormData()
        if (name) form.append("name", name)
        if (description) form.append("description", description)
        if (image) form.append("image", image) // File
        return {
          url: `/categories/${id}`,
          method: "POST",
          body: form,
        }
      },
      transformResponse: (res: Envelope<ApiCategory> | ApiCategory) =>
        toCategory(
          (res as Envelope<ApiCategory>)?.data ?? (res as ApiCategory)
        ),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Categories", id: "LIST" },
        { type: "Categories", id: String(arg.id) },
      ],
    }),
    updateCategoryStatus: b.mutation<Category, UpdateCategoryStatusBody>({
      query: ({ id, status }) => ({
        url: `/categories/${id}/update-status`,
        method: "PUT",
        body: { status: status === "active" ? 1 : 0 },
      }),
      transformResponse: (res: Envelope<ApiCategory> | ApiCategory) =>
        toCategory(
          (res as Envelope<ApiCategory>)?.data ?? (res as ApiCategory)
        ),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Categories", id: "LIST" },
        { type: "Categories", id: String(arg.id) },
      ],
    }),

    deleteCategory: b.mutation<{ success?: boolean }, string | number>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Categories", id: "LIST" },
        { type: "Categories", id: String(id) },
      ],
    }),
  }),
})

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteCategoryMutation,
} = categoryApi

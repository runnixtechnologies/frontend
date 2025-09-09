import { baseApi } from "./baseApi"

export type Category = {
  id: string
  name: string
  status: "active" | "inactive"
}
export type CreateCategoryBody = { name: string }
export type UpdateCategoryBody = { id: string; name: string }
export type UpdateCategoryStatusBody = {
  id: string
  status: "active" | "inactive"
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    createCategory: b.mutation<Category, CreateCategoryBody>({
      query: (body) => ({ url: "/category", method: "POST", body }),
      invalidatesTags: ["Categories"],
    }),
    getAllCategories: b.query<Category[], void>({
      query: () => ({ url: "/category" }),
      providesTags: ["Categories"],
    }),
    getSingleCategory: b.query<Category, string>({
      query: (id) => ({ url: `/category/${id}` }),
      providesTags: ["Categories"],
    }),
    updateCategory: b.mutation<Category, UpdateCategoryBody>({
      query: ({ id, ...body }) => ({
        url: `/category/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategoryStatus: b.mutation<
      { success: boolean },
      UpdateCategoryStatusBody
    >({
      query: ({ id, status }) => ({
        url: `/category/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: b.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/category/${id}`, method: "DELETE" }),
      invalidatesTags: ["Categories"],
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

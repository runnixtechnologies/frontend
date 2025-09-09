import { baseApi } from "./baseApi"

export type StoreType = {
  id: string
  name: string
  status: "active" | "inactive"
}
export type CreateStoreTypeBody = { name: string }
export type UpdateStoreTypeBody = { id: string; name: string }
export type UpdateStoreTypeStatusBody = {
  id: string
  status: "active" | "inactive"
}

export const storeTypeApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    createStoreType: b.mutation<StoreType, CreateStoreTypeBody>({
      query: (body) => ({ url: "/store/type", method: "POST", body }),
      invalidatesTags: ["StoreTypes"],
    }),
    getAllStoreTypes: b.query<StoreType[], void>({
      query: () => ({ url: "/store/type" }),
      providesTags: ["StoreTypes"],
    }),
    getSingleStoreType: b.query<StoreType, string>({
      query: (id) => ({ url: `/store/type/${id}` }),
      providesTags: ["StoreTypes"],
    }),
    updateStoreType: b.mutation<StoreType, UpdateStoreTypeBody>({
      query: ({ id, ...body }) => ({
        url: `/store/type/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["StoreTypes"],
    }),
    updateStoreTypeStatus: b.mutation<
      { success: boolean },
      UpdateStoreTypeStatusBody
    >({
      query: ({ id, status }) => ({
        url: `/store/type/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["StoreTypes"],
    }),
    deleteStoreType: b.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/store/type/${id}`, method: "DELETE" }),
      invalidatesTags: ["StoreTypes"],
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

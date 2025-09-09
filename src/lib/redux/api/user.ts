import { baseApi } from "./baseApi"

export type User = { id: string; name: string; email: string; status: string }
export type UserStats = { total: number; active: number; inactive: number }
export type UpdateUserStatusBody = { id: string; status: "active" | "inactive" }

export const userApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getUserStats: b.query<UserStats, void>({
      query: () => ({ url: "/users/stats" }),
      providesTags: ["Users"],
    }),
    getUsers: b.query<User[], { page?: number; limit?: number } | void>({
      query: (q) => ({ url: "/users", params: q ?? {} }),
      providesTags: ["Users"],
    }),
    getSingleUser: b.query<User, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: ["Users"],
    }),
    updateUserStatus: b.mutation<{ success: boolean }, UpdateUserStatusBody>({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
})

export const {
  useGetUserStatsQuery,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserStatusMutation,
} = userApi

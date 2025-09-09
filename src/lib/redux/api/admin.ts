import { baseApi } from "./baseApi"

export type Admin = {
  id: string
  name: string
  email: string
  role: string
  status: string
}
export type InviteAdminBody = {
  firstName: string
  lastName: string
  email: string
  role: string
}
export type UpdateAdminRoleBody = { permissionIds: number[]; roleId: number }
export type UpdateAdminStatusBody = {
  status: string
  remark: string
  adminId: string
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    inviteAdmin: b.mutation<
      { success: boolean; message: string },
      InviteAdminBody
    >({
      query: (body) => ({ url: "/admin/invite", method: "POST", body }),
      invalidatesTags: ["Admins"],
    }),
    acceptInvite: b.query<
      { success: boolean; message: string },
      { token: string }
    >({
      query: ({ token }) => ({
        url: "/admin/accept-invite",
        params: { token },
      }),
      providesTags: ["Admins"],
    }),
    updateAdminRole: b.mutation<
      { success: boolean; message: string },
      UpdateAdminRoleBody
    >({
      query: (body) => ({ url: "/admin/update-role", method: "POST", body }),
      invalidatesTags: ["Admins"],
    }),
    updateAdminStatus: b.mutation<
      // response type (adjust if you have one)
      { status: string; message: string },
      UpdateAdminStatusBody
    >({
      query: ({ adminId, status, remark }) => ({
        url: `/admin/members/${adminId}/update-status`,
        method: "POST",
        body: { status, remark },
      }),
      invalidatesTags: ["Admins"],
    }),
    getAllAdmins: b.query<Admin[], { page?: number; limit?: number } | void>({
      query: (q) => ({ url: "/admin/members", params: q ?? {} }),
      providesTags: ["Admins"],
    }),
    getSingleAdmin: b.query<Admin, string>({
      query: (id) => ({ url: `/admin/${id}` }),
      providesTags: ["Admins"],
    }),
  }),
})

export const {
  useInviteAdminMutation,
  useAcceptInviteQuery,
  useUpdateAdminRoleMutation,
  useUpdateAdminStatusMutation,
  useGetAllAdminsQuery,
  useGetSingleAdminQuery,
} = adminApi

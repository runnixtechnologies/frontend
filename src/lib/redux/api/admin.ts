import { baseApi } from "./baseApi"
// --- types for the single-admin detail ---
export type AdminActivityLog = {
  id: number
  admin_id: number
  name: string
  email: string
  action: string
  target: string | null
  target_reference: string | null
  data: string // often JSON string from backend
  status: number
  created_at: string
  updated_at: string
}

export type AdminRole = {
  id: number
  name: string
  code: "super-admin" | "admin" | "customer-support" | string
  status: number
  created_at: string
  updated_at: string
}

// Backend sometimes returns either:
// - an array of permission objects (with id, name...) OR
// - a pivot-like array containing permission_id
export type AdminPermission =
  | { id: number; name?: string; code?: string; permission_id?: never }
  | { permission_id: number; id?: never; name?: never; code?: never }

export type AdminDetail = {
  id: number
  firstname: string
  lastname: string
  username: string | null
  email: string
  role_id: number
  remarks: string | null
  photo: string | null
  joined_at: string
  status: "active" | "inactive" | "suspended" | string
  created_at: string
  updated_at: string
  deleted_at: string | null
  permissions: AdminPermission[]
  role: AdminRole
  activity_logs: AdminActivityLog[]
}

export type AdminDetailResponse = {
  status: string // "00" on success
  message: string
  data: AdminDetail
  errors: unknown[]
}

export type Admin = {
  id: string
  name: string
  email: string
  role: string
  status: string
}
export type InviteAdminBody = {
  firstname: string
  lastname: string
  email: string
  role_id: number
  permission_ids: number[]
}

export type UpdateAdminRoleBody = {
  permission_ids: number[]
  role_id: number
  admin_id: number
}
export type UpdateAdminStatusBody = {
  status: string
  remarks: string
  admin_id: number
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    inviteAdmin: b.mutation<
      { success: boolean; message: string },
      InviteAdminBody
    >({
      query: (body) => ({ url: "/admin/invite-member", method: "POST", body }),
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
      query: ({ role_id, permission_ids, admin_id }) => ({
        url: `admin/members/${admin_id}/update-role`,
        method: "POST",
        body: { role_id, permission_ids },
      }),
      invalidatesTags: ["Admins"],
    }),
    updateAdminStatus: b.mutation<
      // response type (adjust if you have one)
      { status: string; message: string },
      UpdateAdminStatusBody
    >({
      query: ({ admin_id, status, remarks }) => ({
        url: `/admin/members/${admin_id}/update-status`,
        method: "POST",
        body: { status, remarks },
      }),
      invalidatesTags: ["Admins"],
    }),
    getAllAdmins: b.query<Admin[], { page?: number; limit?: number } | void>({
      query: (q) => ({ url: "/admin/members", params: q ?? {} }),
      providesTags: ["Admins"],
    }),
    getSingleAdmin: b.query<AdminDetailResponse, number | string>({
      query: (admin_id) => ({
        url: `/admin/members/${admin_id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, admin_id) => [{ type: "Admins", admin_id }],
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

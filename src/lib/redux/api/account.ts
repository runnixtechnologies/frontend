import { baseApi } from "./baseApi"

/* -------------------- Types -------------------- */

export type ApiEnvelope<T> = {
  status?: string // e.g. "00"
  message?: string
  data?: T
  errors?: unknown[]
}

export type ApiProfile = {
  id: number | string
  email: string
  phone?: string | null
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
  role?: string | null
  created_at?: string
  updated_at?: string
}

export type ApiSettings = {
  // Adjust these to your backend’s fields
  notifications_email?: boolean
  notifications_push?: boolean
  dark_mode?: boolean
  locale?: string
  timezone?: string
  // add more as needed…
}

/** UI-facing shapes (you can keep them equal to API or reshape here) */
export type MyProfile = ApiProfile
export type MySettings = ApiSettings

/* -------------------- Helpers -------------------- */

function unwrap<T>(res: ApiEnvelope<T> | T): T {
  return (res as ApiEnvelope<T>)?.data ?? (res as T)
}

/* -------------------- Slice -------------------- */

export const accountApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /* ---------- PROFILE ---------- */

    // GET /me (or /profile) — pick the one your backend exposes
    getMyProfile: b.query<MyProfile, void>({
      query: () => ({ url: "/me", method: "GET" }),
      transformResponse: (res: ApiEnvelope<ApiProfile> | ApiProfile) =>
        unwrap<ApiProfile>(res),
      providesTags: [{ type: "Account", id: "PROFILE" }],
    }),

    // PUT /me (JSON) — update profile fields (no file)
    updateMyProfile: b.mutation<MyProfile, Partial<ApiProfile>>({
      query: (body) => ({
        url: "/me",
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiEnvelope<ApiProfile> | ApiProfile) =>
        unwrap<ApiProfile>(res),
      invalidatesTags: [{ type: "Account", id: "PROFILE" }],
    }),

    // POST /me/avatar (multipart) — upload avatar (common Laravel pattern)
    // If your backend expects PUT multipart, switch to method:"POST" with _method=PUT
    updateMyAvatar: b.mutation<MyProfile, { file: File }>({
      query: ({ file }) => {
        const form = new FormData()
        form.append("image", file) // <-- change field name if backend expects "avatar"
        // form.append("_method", "PUT") // uncomment if your backend needs POST + _method=PUT
        return {
          url: "/me/avatar",
          method: "POST",
          body: form,
        }
      },
      transformResponse: (res: ApiEnvelope<ApiProfile> | ApiProfile) =>
        unwrap<ApiProfile>(res),
      invalidatesTags: [{ type: "Account", id: "PROFILE" }],
    }),

    // (Optional) change password
    changeMyPassword: b.mutation<
      { success: boolean },
      { current_password: string; new_password: string }
    >({
      query: (body) => ({
        url: "/me/change-password",
        method: "POST",
        body,
      }),
    }),

    /* ---------- SETTINGS ---------- */

    // GET /me/settings (or /settings)
    getMySettings: b.query<MySettings, void>({
      query: () => ({ url: "/me/settings", method: "GET" }),
      transformResponse: (res: ApiEnvelope<ApiSettings> | ApiSettings) =>
        unwrap<ApiSettings>(res),
      providesTags: [{ type: "Account", id: "SETTINGS" }],
    }),

    // PUT /me/settings (JSON)
    updateMySettings: b.mutation<MySettings, Partial<ApiSettings>>({
      query: (body) => ({
        url: "/me/settings",
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiEnvelope<ApiSettings> | ApiSettings) =>
        unwrap<ApiSettings>(res),
      invalidatesTags: [{ type: "Account", id: "SETTINGS" }],
    }),
  }),
})

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateMyAvatarMutation,
  useChangeMyPasswordMutation,
  useGetMySettingsQuery,
  useUpdateMySettingsMutation,
} = accountApi

import { baseApi } from "./baseApi"

export type LoginBody = { email: string; password: string }

export type Role = {
  id: number
  name: string
  code: "super-admin" | "admin" | "customer-support"
  status: number
  created_at: string
  updated_at: string
}

export type LoginUser = {
  id: number
  firstname: string
  lastname: string
  username: string | null
  email: string
  role_id: number
  remarks: string | null
  photo: string | null
  joined_at: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
  deleted_at: string | null
  token: string // <-- PAT from backend
  role: Role
  permissions: string[]
}

export type LoginResponse = {
  status: "00" | string
  message: string
  data: LoginUser
  errors: unknown[]
}
export type AuthResponse = {
  success: boolean
  message: string
  token?: string
  user?: unknown
  requiresOtp?: boolean
  data: any
}

export type ApiMsg = { success: boolean; message: string }

export type ForgotPasswordBody = { email: string }

export type ForgotPasswordResponse = {
  success: boolean
  message: string
  data: { token: string }
  token?: string
}
export type ResetPasswordBody = {
  token: string
  password: string
  passwordConfirmation?: string
}
export type VerifyOtpBody = {
  code: string
  token: string
}
export type CreatePasswordBody = {
  firstName?: string
  lastName?: string
  role?: "super-admin" | "admin" | "customer-support"
  password: string
  password_confirmation: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // create password
    createPassword: b.mutation<ApiMsg, CreatePasswordBody>({
      query: (body) => ({
        url: "/auth/create-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    // login
    login: b.mutation<LoginResponse, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    // forgot password
    forgotPassword: b.mutation<ForgotPasswordResponse, ForgotPasswordBody>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    // resend OTP
    resendOtp: b.mutation<ApiMsg, { token: string }>({
      query: (params) => ({
        url: "/auth/resend-otp",
        method: "GET",
        params,
      }),
    }),

    // verify OTP
    verifyOtp: b.mutation<AuthResponse, VerifyOtpBody>({
      query: (body) => ({ url: "/auth/verify-otp", method: "POST", body }),
      invalidatesTags: ["Auth"],
    }),

    // reset password
    resetPassword: b.mutation<ApiMsg, ResetPasswordBody>({
      query: ({ token, password, passwordConfirmation }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: {
          token,
          new_password: password,
          confirm_password: passwordConfirmation ?? password,
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useCreatePasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
} = authApi

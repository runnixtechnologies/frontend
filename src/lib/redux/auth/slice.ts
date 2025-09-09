"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { LoginUser } from "@/lib/redux/api/auth"

export interface AuthState {
  user: LoginUser | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginUser>) => {
      state.user = action.payload
      state.token = action.payload.token ?? null
    },
    logout: (state) => {
      state.user = null
      state.token = null
    },
    hydrate: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
  },
})

export const { setCredentials, logout, hydrate } = authSlice.actions
export default authSlice.reducer

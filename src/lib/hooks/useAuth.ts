// lib/hooks/useAuth.ts
"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import type { AuthState } from "@/lib/redux/auth/types"

export function useAuth() {
  const auth = useSelector((s: RootState) => s.Auth) as AuthState
  const token = auth?.token ?? auth?.user?.token ?? null
  const isLoggedIn = Boolean(token)
  const user = auth?.user ?? null
  return { isLoggedIn, user, token }
}

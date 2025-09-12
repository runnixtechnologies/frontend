"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"

type Role = { id: number; name: string; code: string }
type User = {
  id: number
  firstname: string
  lastname: string
  email: string
  role?: Role
  token?: string
} | null

export function useAuth() {
  // if you keep an Auth slice, read it first
  const authSlice = useSelector((s: RootState) => (s as any)?.Auth)
  const sliceToken: string | undefined = authSlice?.token
  const sliceUser: User = authSlice?.user ?? null

  const [lsToken, setLsToken] = useState<string | undefined>(undefined)
  const [lsUser, setLsUser] = useState<User>(null)
  const [ready, setReady] = useState(false)

  // read localStorage once on client
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const t = localStorage.getItem("auth:token") || undefined
        const u = localStorage.getItem("auth:user")
        setLsToken(t)
        setLsUser(u ? (JSON.parse(u) as User) : null)
      }
    } catch {
      setLsToken(undefined)
      setLsUser(null)
    } finally {
      setReady(true)
    }
  }, [])

  // prefer Redux if present, otherwise fall back to LS
  const token = sliceToken ?? lsToken
  const user = (sliceUser ?? lsUser) as User
  const isLoggedIn = Boolean(token)
  return { isLoggedIn, user, token, ready }
}

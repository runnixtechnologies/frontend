import { NextResponse } from "next/server"

const isProd = process.env.NODE_ENV === "production"

export async function POST(req: Request) {
  const { token, role } = (await req.json()) as { token: string; role?: string }

  const res = NextResponse.json({ ok: true })

  // Secure, httpOnly cookie for the PAT
  res.cookies.set("auth:token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Role cookie (client-readable, optional)
  if (role) {
    res.cookies.set("auth:role", role, {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set("auth:token", "", { path: "/", maxAge: 0 })
  res.cookies.set("auth:role", "", { path: "/", maxAge: 0 })
  return res
}

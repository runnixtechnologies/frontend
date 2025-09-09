import { NextResponse } from "next/server"

const isProd = process.env.NODE_ENV === "production"

// Centralize cookie names + flags here
const COOKIES_TO_CLEAR: Array<{ name: string; httpOnly?: boolean }> = [
  { name: "auth:token", httpOnly: true }, // PAT / access token
  { name: "auth:role" }, // role hint (non-httpOnly)
  { name: "otp:pending", httpOnly: true }, // OTP progress
  { name: "auth:refresh", httpOnly: true }, // refresh token
  { name: "csrf-token" }, // CSRF token
]

function clear(res: NextResponse, name: string, opts?: { httpOnly?: boolean }) {
  res.cookies.set(name, "", {
    httpOnly: opts?.httpOnly ?? false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0, // clear immediately
  })
}

/** Universal logout — clears all known cookies */
export async function DELETE() {
  const res = NextResponse.json({ ok: true })

  for (const { name, httpOnly } of COOKIES_TO_CLEAR) {
    clear(res, name, { httpOnly })
  }

  res.headers.set("Cache-Control", "no-store")
  return res
}

/** Login/session init — set token + role */
export async function POST(req: Request) {
  const { token, role } = (await req.json()) as { token: string; role?: string }
  const res = NextResponse.json({ ok: true })

  // Set auth:token (httpOnly)
  res.cookies.set("auth:token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Set role (client-readable)
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

// middleware.ts
import { NextResponse, type NextRequest } from "next/server"

const AUTH_COOKIE = "auth:token"
const ROLE_COOKIE = "auth:role"

const PUBLIC = new Set([
  "/",
  "/landing",
  "/login",
  "/login/admin",
  "/signup",
  "/signup/admin",
  "/forgot-password",
  "/forgot-password/success",
  "/reset-password",
  "/otp",
])

const PUBLIC_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/otp",
  "/landing",
]

const ROLE_GATES: Array<{ prefix: string; allow: string[] }> = [
  { prefix: "/admin", allow: ["super-admin", "admin", "customer-support"] },
  { prefix: "/merchant", allow: ["merchant"] },
]

function normalizePath(path: string) {
  if (path === "/") return "/"
  return path.endsWith("/") ? path.slice(0, -1) : path
}

function isPublic(path: string) {
  if (PUBLIC.has(path)) return true
  return PUBLIC_PREFIXES.some((p) => path.startsWith(p))
}

function findGate(path: string) {
  return ROLE_GATES.find((g) => path.startsWith(g.prefix))
}

function isBypassed(path: string) {
  return (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path === "/favicon.ico"
  )
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const pathname = normalizePath(url.pathname)

  if (isBypassed(pathname)) return NextResponse.next()

  const token = req.cookies.get(AUTH_COOKIE)?.value ?? ""
  const roleRaw = req.cookies.get(ROLE_COOKIE)?.value ?? ""
  const role = roleRaw.toLowerCase()
  const isAuthed = Boolean(token)
  const isPublicRoute = isPublic(pathname)

  // --- 1) Unauthed users trying to access protected routes ---
  if (!isAuthed && !isPublicRoute) {
    const next = pathname + (url.search ? url.search : "")
    const redirect = url.clone()

    // If it's an admin section, go to /login/admin else /login
    const gate = findGate(pathname)
    const isAdminGate = gate?.prefix === "/admin"
    redirect.pathname = isAdminGate ? "/login/admin" : "/login"
    redirect.search = `?next=${encodeURIComponent(next)}`
    return NextResponse.redirect(redirect)
  }

  // --- 2) Authed visiting a login page -> bounce to dashboard by role ---
  if (isAuthed && (pathname === "/login" || pathname === "/login/admin")) {
    const redirect = url.clone()

    if (["super-admin", "admin", "customer-support"].includes(role)) {
      redirect.pathname = "/admin/dashboard"
    } else if (role === "merchant") {
      redirect.pathname = "/merchant/dashboard"
    } else {
      redirect.pathname = "/dashboard" // fallback
    }

    redirect.search = ""
    return NextResponse.redirect(redirect)
  }

  // --- 3) Role gates (still enforce gates on protected routes) ---
  if (isAuthed) {
    const gate = findGate(pathname)
    if (gate) {
      const allowed = gate.allow.map((a) => a.toLowerCase())
      if (!role || !allowed.includes(role)) {
        const redirect = url.clone()
        redirect.pathname = "/403"
        redirect.search = ""
        return NextResponse.redirect(redirect)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

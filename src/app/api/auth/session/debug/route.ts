import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const c = await cookies()
  return NextResponse.json({
    hasToken: !!c.get("auth:token"),
    role: c.get("auth:role")?.value ?? null,
  })
}

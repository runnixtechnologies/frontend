// app/api/preview/disable/route.ts
import { draftMode } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  // 1. Await the promise
  const dm = await draftMode()

  // 2. Turn off Draft Mode
  dm.disable() // or  dm.enable({ maxAge: 60 * 30 })

  // 3. Redirect to a published page
  return NextResponse.redirect(new URL("/", req.url), 307)
}

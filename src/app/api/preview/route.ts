// app/api/preview/route.ts
import { draftMode } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  const secret = searchParams.get("secret")

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  const dm = await draftMode()
  dm.enable() // ✅ no arguments
  return NextResponse.redirect(
    new URL(slug ? `/landing/blog/${slug}` : "/", req.url),
    307
  )
}

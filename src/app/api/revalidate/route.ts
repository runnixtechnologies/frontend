import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { createHmac, timingSafeEqual } from "node:crypto"

/* -------------------------------------------------------------------------- */
/*  CONFIG                                                                    */
/* -------------------------------------------------------------------------- */
const WEBHOOK_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET!
const DEFAULT_LOCALE = "en-US"

/**
 * Map Contentful content‑type IDs to route factories. Extend as needed.
 */
const CONTENT_TYPE_MAP = {
  /** Contentful ID for your Blog Post model */
  blogPost: (slug: string) => `/landing/blog/${slug}`,
} as const satisfies Record<string, (slug: string) => string> satisfies Record<
  string,
  (slug: string) => string
>

type SupportedContentType = keyof typeof CONTENT_TYPE_MAP

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
interface ContentfulWebhookPayload {
  sys?: {
    contentType?: {
      sys?: { id?: string }
    }
  }
  fields?: {
    slug?: Record<string, string>
  }
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */
function verifyHmac(rawBody: ArrayBuffer, signatureHex: string | null) {
  if (!signatureHex) return false
  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(Buffer.from(rawBody))
    .digest()
  let provided: Buffer
  try {
    provided = Buffer.from(signatureHex, "hex")
  } catch {
    return false
  }
  return (
    provided.length === expected.length && timingSafeEqual(provided, expected)
  )
}

/* -------------------------------------------------------------------------- */
/*  POST handler                                                              */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  // 1. Read raw body (needed for HMAC verification)
  const rawBody = await req.arrayBuffer()
  const signature = req.headers.get("x-contentful-webhook-signature")
  if (!verifyHmac(rawBody, signature)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // 2. Parse JSON payload
  let payload: ContentfulWebhookPayload
  try {
    payload = JSON.parse(
      Buffer.from(rawBody).toString("utf-8")
    ) as ContentfulWebhookPayload
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 })
  }

  const contentType = (payload.sys?.contentType?.sys?.id ??
    null) as SupportedContentType | null
  const slug = payload.fields?.slug?.[DEFAULT_LOCALE] ?? null

  /* ---------------------------------------------------------------------- */
  /*  Revalidate                                                            */
  /* ---------------------------------------------------------------------- */
  try {
    // Global
    revalidatePath("/landing")
    revalidatePath("/landing/blog")
    revalidateTag("blog-posts")

    // Specific entry
    if (slug && contentType && contentType in CONTENT_TYPE_MAP) {
      const path = CONTENT_TYPE_MAP[contentType](slug)
      revalidatePath(path)
      revalidateTag(`post-${slug}`)
      console.log(`[Revalidated] ${contentType}:${slug}`)
    }

    return NextResponse.json({ revalidated: true })
  } catch (err) {
    console.error("[Revalidate error]", err)
    return NextResponse.json(
      { message: "Failed to revalidate", error: (err as Error).message },
      { status: 500 }
    )
  }
}

/* -------------------------------------------------------------------------- */
/*  GET health‑check                                                          */
/* -------------------------------------------------------------------------- */
export async function GET() {
  return NextResponse.json({ ok: true })
}

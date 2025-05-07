import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(req: NextRequest) {
  // 1. Validate the request (security)
  const secret = req.headers.get("contentful-webhook-secret")
  if (secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // 2. Extract relevant data from the webhook payload
  const body = await req.json()
  const contentType = body?.sys?.contentType?.sys?.id
  const slug = body?.fields?.slug?.["en-US"]

  try {
    revalidatePath("/landing") // Revalidate homepage
    revalidatePath("/landing/blog") // Revalidate blog list page
    revalidateTag("blog-posts") // Revalidate all blog-related content
    if (contentType === "Blog Post" && slug) {
      revalidatePath(`/landing/blog/${slug}`) // Path-based for the specific post
      revalidateTag(`post-${slug}`) // Tag-based for the specific post

      console.log(`Revalidated blog post: ${slug}`)
    }

    return NextResponse.json({
      revalidated: true,
      message:
        contentType === "Blog Post" && slug
          ? `Revalidated blog post: ${slug}`
          : "Revalidated blog section",
    })
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: (err as Error).message,
      },
      { status: 500 }
    )
  }
}

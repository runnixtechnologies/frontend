import { type NextRequest, NextResponse } from "next/server"
import { getCommentsBySlug } from "@/lib/contentful"
import { createClient } from "contentful-management"

/* -------------------------------------------------------------------------- */
/*  ENV                                                                       */
/* -------------------------------------------------------------------------- */
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!
const ENV_ID = process.env.CONTENTFUL_ENVIRONMENT || "master"
const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN!

const cmClient = createClient({ accessToken: CMA_TOKEN })

/* -------------------------------------------------------------------------- */
/*  GET – return approved comments for a post slug                            */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ message: "Missing slug" }, { status: 400 })
  }

  try {
    const comments = await getCommentsBySlug(slug)
    return NextResponse.json({ comments }, { status: 200 })
  } catch (error) {
    console.error("Error fetching comments", error)
    return NextResponse.json(
      { message: "Failed to load comments" },
      { status: 500 }
    )
  }
}

/* -------------------------------------------------------------------------- */
/*  POST – create & publish a new comment                                     */
/* -------------------------------------------------------------------------- */
interface NewCommentBody {
  name?: string
  email?: string
  comment?: string
  slug?: string
}

export async function POST(req: NextRequest) {
  const { name, email, comment, slug } = (await req.json()) as NewCommentBody
  if (!name || !comment || !slug) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 })
  }

  try {
    // Lookup the blog post entry ID by slug
    const space = await cmClient.getSpace(SPACE_ID)
    const env = await space.getEnvironment(ENV_ID)
    const postRes = await env.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
    })
    const blogPost = postRes.items[0]
    if (!blogPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    // Create & publish the comment
    const entry = await env.createEntry("comment", {
      fields: {
        name: { "en-US": name },
        email: { "en-US": email ?? "" },
        message: { "en-US": comment },
        postedAt: { "en-US": new Date().toISOString() },
        approved: { "en-US": true },
        blogPost: {
          "en-US": {
            sys: { type: "Link", linkType: "Entry", id: blogPost.sys.id },
          },
        },
      },
    })
    await entry.publish()

    return NextResponse.json({ created: true }, { status: 201 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating comment:", error)
    // expose error.message for debugging
    return NextResponse.json(
      { message: error.message || "Failed to create comment" },
      { status: 500 }
    )
  }
}

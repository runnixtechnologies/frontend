import {
  type ContentfulAsset,
  type ContentfulBlogPost,
  fetchGraphQL,
  GET_BLOG_POSTS,
  getAllSlugs,
  getCommentsBySlug,
  getPostBySlug,
} from "@/lib/contentful"
import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"
import moment from "moment"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import LeaveComment from "../_components/Comment"

export const dynamicParams = true
export const revalidate = 3600

type Params = { slug: string }

/* ────────────────────────────────────────────────────────────────────────── */
/*  Static params & metadata                                                 */
/* ────────────────────────────────────────────────────────────────────────── */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  // ❗ With dynamicIO, params is a Promise
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const imageUrl = post.heroImage?.url?.startsWith("//")
    ? `https:${post.heroImage.url}`
    : post.heroImage?.url ?? "https://www.runnix.africa/default-heroImage.jpg"

  return {
    title: post.title,
    description: post.excerpt || `Blog post about ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Blog post about ${post.title}`,
      url: `https://www.runnix.africa/blog/${post.slug}`,
      images: [{ url: imageUrl, width: 800, height: 600, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Blog post about ${post.title}`,
      images: [imageUrl],
    },
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Helper to fetch the four newest posts for "Explore More"                 */
/* ────────────────────────────────────────────────────────────────────────── */
async function getPosts(): Promise<ContentfulBlogPost[]> {
  try {
    const data = await fetchGraphQL<{
      blogPostCollection: { items: ContentfulBlogPost[] }
    }>(GET_BLOG_POSTS, undefined, ["blog-posts"])
    return data.blogPostCollection.items
  } catch (e) {
    console.error("Error fetching blog posts", e)
    return []
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  PAGE                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */
export default async function BlogPostPage({
  // ❗ With dynamicIO, params is a Promise
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return notFound()

  const [posts, comments] = await Promise.all([
    getPosts(),
    getCommentsBySlug(slug),
  ])

  const { json, links } = post.body
  const assetMap = new Map<string, ContentfulAsset>(
    links?.assets?.block.map((a) => [a.sys.id, a]) ?? []
  )

  const renderOptions: Options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId = node.data.target.sys.id as string
        const asset = assetMap.get(assetId)
        if (!asset) return null
        const url = asset.url.startsWith("//")
          ? `https:${asset.url}`
          : asset.url
        const alt = asset.description || asset.title || "Embedded image"
        return (
          <div className="my-6">
            <Image
              src={url || "/placeholder.svg"}
              alt={alt}
              width={asset.width || 800}
              height={asset.height || 450}
              className="object-cover rounded-md"
              priority
            />
          </div>
        )
      },
    },
  }

  return (
    <section className="w-full relative dark:bg-[#161226] bg-white/50 flex flex-col items-center py-10 lg:py-20 gap-12">
      {/* Header */}
      <div className="w-full max-w-[800px] px-6 flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <h1 className="font-figtree text-[#232323] dark:text-[#DCDCDC] font-bold text-3xl xl:text-5xl leading-tight">
            {post.title}
          </h1>
          <div className="flex justify-between text-lg xl:text-2xl text-[#525252] dark:text-[#DCDCDC]">
            <span>{post.author?.name ?? "Unknown Author"}</span>
            <span>{moment(post.publishDate).format("MMMM D, YYYY")}</span>
          </div>
        </div>
        {post.heroImage?.url && (
          <Image
            src={
              post.heroImage.url.startsWith("//")
                ? `https:${post.heroImage.url}`
                : post.heroImage.url
            }
            alt={post.heroImage.description || "Blog image"}
            width={800}
            height={365}
            className="object-cover rounded-md"
            priority
          />
        )}
      </div>

      {/* Body */}
      <article className="w-full max-w-[800px] px-6 prose dark:prose-invert">
        {documentToReactComponents(json, renderOptions)}
      </article>

      {/* Comments */}
      <section className="w-full bg-[#F9F9F9] dark:bg-[#1D192B] py-16 flex justify-center">
        <div className="w-full max-w-[800px] px-6 flex flex-col gap-12">
          <div className="flex justify-between items-center">
            <h2 className="font-figtree font-bold text-2xl text-[#232323] dark:text-[#DCDCDC]">
              Comments
            </h2>
            <LeaveComment slug={post.slug} />
          </div>
          {comments?.map((c) => (
            <div key={c.sys.id} className="space-y-2">
              <div>
                <h4 className="font-semibold text-[#17181A] dark:text-[#DCDCDC]">
                  {c.name}
                </h4>
                <time>{moment(c.postedAt).fromNow()}</time>
              </div>
              <p>{c.message}</p>
            </div>
          ))}
          {(comments?.length ?? 0) === 0 && (
            <p>No comments yet — be the first!</p>
          )}
        </div>
      </section>

      {/* Explore more */}
      <section className="w-full flex justify-center">
        <div className="w-full max-w-[800px] px-6 flex flex-col gap-6">
          <h2 className="font-figtree font-bold text-2xl text-[#232323] dark:text-[#DCDCDC]">
            Explore More
          </h2>
          <div className="grid gap-9 sm:grid-cols-2">
            {posts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 4)
              .map((p) => {
                const img = p.heroImage?.url?.startsWith("//")
                  ? `https:${p.heroImage.url}`
                  : p.heroImage?.url || "/placeholder.png"
                return (
                  <Link
                    href={`/landing/blog/${p.slug}`}
                    key={p.slug}
                    className="border border-[#E4E3E5] rounded-lg p-4 hover:scale-[1.01] transition-transform flex flex-col gap-4 bg-white"
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={p.title}
                      width={338}
                      height={240}
                      className="rounded"
                    />
                    <h3 className="font-bold text-[#232323]">{p.title}</h3>
                    {p.excerpt && (
                      <p className="text-[#7C7C7C] line-clamp-3">{p.excerpt}</p>
                    )}
                    <div className="flex justify-between text-sm text-[#7C7C7C]">
                      <span>{p.author?.name ?? "Unknown Author"}</span>
                      <span>{moment(p.publishDate).format("D MMM YYYY")}</span>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>
    </section>
  )
}

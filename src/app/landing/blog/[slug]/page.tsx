import {
  ContentfulAsset,
  ContentfulBlogPost,
  fetchGraphQL,
  GET_BLOG_POSTS,
  getAllSlugs,
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
export const revalidate = 3600 // every hour

type Params = { slug: string }

const comments = [
  {
    name: "Aisha Abdulkadir",
    content:
      "Eget aenean vulputate nunc sed mi. At diam diam arcu euismod nisl convallis mattis.",
    date: "26/04/2025",
  },
  {
    name: "Reedon Hasheema",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: "20/04/2025",
  },
]

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

// export async function generateMetadata({
//   params,
// }: {
//   params: Params
// }): Promise<Metadata> {
//   const { slug } = await params
//   const post = await getPostBySlug(slug)
//   if (!post) return {}

//   const imageUrl = post?.heroImage?.url?.startsWith("//")
//     ? `https:${post?.heroImage.url}`
//     : post?.heroImage?.url ?? "https://www.runnix.africa/default-heroImage.jpg"

//   return {
//     title: post.title,
//     description: post.excerpt || `Blog post about ${post.title}`,
//     openGraph: {
//       title: post.title,
//       description: post.excerpt || `Blog post about ${post.title}`,
//       url: `https://www.runnix.africa/blog/${post.slug}`,
//       images: [
//         {
//           url: imageUrl,
//           width: 800,
//           height: 600,
//           alt: post?.heroImage?.description || post.title,
//         },
//       ],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: post.title,
//       description: post.excerpt || `Blog post about ${post.title}`,
//       images: [imageUrl],
//     },
//   }
// }
export async function generateMetadata({
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

async function getPosts(): Promise<ContentfulBlogPost[]> {
  try {
    const data = await fetchGraphQL<{
      blogPostCollection: { items: ContentfulBlogPost[] }
    }>(GET_BLOG_POSTS, undefined, ["blog-posts"])

    return data?.blogPostCollection.items ?? []
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return notFound()

  const posts = await getPosts()
  const { json, links } = post.body

  const assetMap = new Map<string, ContentfulAsset>(
    links?.assets?.block.map((asset) => [asset.sys.id, asset]) ?? []
  )

  const renderOptions: Options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId: string = node.data.target.sys.id
        const asset = assetMap.get(assetId)
        if (!asset) return null

        const imageUrl = asset.url.startsWith("//")
          ? `https:${asset.url}`
          : asset.url
        const altText = asset.description || asset.title || "Embedded image"

        return (
          <div className="my-6">
            <Image
              src={imageUrl}
              alt={altText}
              width={asset.width || 800}
              height={asset.height || 450}
              className="object-cover rounded-md"
            />
          </div>
        )
      },
    },
  }

  return (
    <>
      <section className="w-full relative dark:bg-[#161226] bg-white/50 flex flex-col justify-center items-center py-10 lg:py-20 3xl:pb-30 gap-[48px]">
        <div className="w-full xl:w-[800px] flex flex-col justify-center items-center gap-[48px] px-6 2xl:px-0">
          <div className="w-full flex flex-col gap-[12px]">
            <h1 className="dark:text-[#DCDCDC] text-[#232323] font-figtree font-bold text-[24px] xl:text-[48px] leading-[120%] -tracking-[2%]">
              {post?.title}
            </h1>
            <div className="w-full h-[29px] lg:w-[448px] flex justify-between gap-6 font-figtree font-normal text-lg xl:text-[24px] leading-[120%] dark:text-[#DCDCDC] text-[#525252] -tracking-[2%]">
              <span>{post?.author?.name ?? "Unknown Author"}</span>
              <span>{moment(post?.publishDate).format("MMMM D, YYYY")}</span>
            </div>
          </div>
        </div>
        {post.heroImage?.url && (
          <Image
            src={
              post.heroImage?.url?.startsWith("//")
                ? `https:${post.heroImage.url}`
                : post.heroImage?.url || "/placeholder.png"
            }
            alt={post.heroImage?.description || "Blog image"}
            width={800}
            height={365}
            className="object-cover"
          />
        )}

        <div className="w-full flex flex-col justify-center items-center gap-6">
          <div className="w-full flex flex-col justify-center items-center gap-6">
            <div className="w-full xl:w-[800px] flex flex-col justify-center items-center gap-2 px-6 2xl:px-0">
              <div className="w-full">
                {documentToReactComponents(json, renderOptions)}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-6 dark:bg-[#1D192B] bg-[#F9F9F9] py-16">
          <div className="w-full xl:w-[800px] flex flex-col justify-center items-center gap-[48px] px-6 2xl:px-0">
            <div className="w-full flex justify-between gap-6">
              <h4 className="font-figtree font-bold dark:text-[#DCDCDC] text-[#232323] text-[32px] leading-[120%] -tracking-[2%]">
                Comments
              </h4>
              <LeaveComment />
            </div>
            {comments?.map((comment, index) => (
              <div key={index} className="w-full flex flex-col gap-3">
                <div className="w-full flex flex-col">
                  <h4 className="font-figtree font-normal text-[18px]/[120%] dark:text-[#DCDCDC] text-[#17181A] -tracking-[2%]">
                    {comment.name}
                  </h4>
                  <p className="font-figtree font-normal text-[16px]/[120%] dark:text-[#DCDCDC] text-[#5F6065] tracking-normal">
                    {moment(comment.date, "DD/MM/YYYY")
                      .startOf("day")
                      .fromNow()}
                  </p>
                </div>
                <p className="font-figtree font-normal text-[18px]/[140%] dark:text-[#DCDCDC] text-[#232323] tracking-normal">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  ligula nibh, interdum non enim sit amet, iaculis aliquet nunc.
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-6">
          <div className="w-full xl:w-[800px] flex flex-col justify-center items-center gap-6 px-6 2xl:px-0">
            <div className="w-full">
              <h4 className="font-figtree font-bold dark:text-[#DCDCDC] text-[#232323] text-[32px] leading-[120%] -tracking-[2%]">
                Explore More
              </h4>
            </div>
            <div className="w-full gap-[36px] grid grid-cols-1 xl:grid-cols-2">
              {posts
                .filter((item) => item.slug !== post.slug)
                .slice(0, 4)
                .map((item) => {
                  const heroImageUrl = item.heroImage?.url?.startsWith("//")
                    ? `https:${item.heroImage.url}`
                    : item.heroImage?.url || "/images/placeholder.png"

                  return (
                    <Link
                      href={`/landing/blog/${item.slug}`}
                      key={item.slug}
                      className="bg-white flex flex-col gap-[20px] pt-4 pb-5 px-4 rounded-[16px] border border-[#E4E3E5] hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                    >
                      <Image
                        src={heroImageUrl}
                        alt={item.heroImage?.description || item.title}
                        width={338}
                        height={240}
                        className="w-full h-[240px] rounded-[8px] object-cover"
                      />
                      <h4 className="font-figtree font-bold text-[#232323] text-[20px] leading-[120%] -tracking-[2%]">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="font-metrophobic font-normal text-[16px] leading-[120%] text-[#7C7C7C] -tracking-[2%]">
                          {item.excerpt}
                        </p>
                      )}
                      <div className="w-full h-[20px] flex justify-between items-center">
                        <p className="font-figtree font-semibold text-[14px]/[20px] text-[#232323] tracking-normal">
                          {item.author?.name ?? "Unknown Author"}
                        </p>
                        <p className="font-figtree font-normal text-[14px]/[20px] text-[#7C7C7C] tracking-normal">
                          {moment(item.publishDate).format("D MMM YYYY")}
                        </p>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// app/(routes)/landing/blog/BlogPosts.tsx
import {
  ContentfulBlogPost,
  fetchGraphQL,
  GET_BLOG_POSTS,
} from "@/lib/contentful"
import BlogCards from "./BlogCard"

export const revalidate = 3600 // Revalidate every hour

async function getPosts(): Promise<ContentfulBlogPost[]> {
  try {
    const data = await fetchGraphQL<{
      blogPostCollection: { items: ContentfulBlogPost[] }
    }>(GET_BLOG_POSTS, undefined, ["blog-posts"])
    return data?.blogPostCollection.items
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export default async function BlogPosts() {
  const posts = await getPosts()

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        Failed to load blog posts. Please try again later.
      </div>
    )
  }

  return <BlogCards posts={posts} />
}

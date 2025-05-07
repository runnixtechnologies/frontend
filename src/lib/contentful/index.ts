import { Document } from "@contentful/rich-text-types"
import { GraphQLClient } from "graphql-request"

/* -------------------------------------------------------------------------- */
/*  ENVIRONMENT                                                               */
/* -------------------------------------------------------------------------- */
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master"

if (!SPACE_ID || !ACCESS_TOKEN) {
  throw new Error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN")
}

/* -------------------------------------------------------------------------- */
/*  GraphQL client                                                            */
/* -------------------------------------------------------------------------- */
export const client = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`,
  {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  }
)

/* -------------------------------------------------------------------------- */
/*  GraphQL Queries                                                           */
/* -------------------------------------------------------------------------- */
export const GET_BLOG_POSTS = /* GraphQL */ `
  query GetBlogPosts {
    blogPostCollection(order: publishDate_DESC) {
      items {
        slug
        title
        excerpt
        publishDate
        author {
          ... on Author {
            name
          }
        }
        heroImage {
          url
          title
          description
        }
      }
    }
  }
`
export const GET_BLOG_POST = /* GraphQL */ `
  query GetBlogPost($slug: String!) {
    blogPostCollection(where: { slug: $slug }, limit: 1) {
      items {
        title
        slug
        publishDate
        excerpt
        author {
          ... on Author {
            name
            picture {
              url
              description
            }
          }
        }
        heroImage {
          url
          title
          description
        }
        body {
          json
          links {
            assets {
              block {
                sys {
                  id
                }
                url
                title
                description
                contentType
                width
                height
              }
            }
            entries {
              block {
                sys {
                  id
                }
                __typename
              }
              inline {
                sys {
                  id
                }
                __typename
              }
            }
          }
        }
      }
    }
  }
`

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
export type ContentfulAsset = {
  sys: { id: string }
  url: string
  title: string
  description?: string
  contentType?: string
  width?: number
  height?: number
}

export type ContentfulAuthor = {
  name: string
  picture?: { url: string; description?: string }
}

// export type ContentfulBlogPost = {
//   title: string
//   slug: string
//   publishDate: string
//   excerpt?: string
//   author?: ContentfulAuthor
//   heroImage?: { url: string; title?: string; description?: string }
//   content: {
//     json: Document
//     links?: {
//       assets?: {
//         block: ContentfulAsset[]
//       }
//       entries?: {
//         block?: Array<{ sys: { id: string }; __typename?: string }>
//         inline?: Array<{ sys: { id: string }; __typename?: string }>
//       }
//     }
//   }
// }

export type ContentfulBlogPost = {
  title: string
  slug: string
  publishDate: string
  excerpt?: string
  author?: ContentfulAuthor
  heroImage?: { url: string; title?: string; description?: string }
  body: {
    json: Document
    links?: {
      assets?: { block: ContentfulAsset[] }
      entries?: {
        block?: Array<{ sys: { id: string }; __typename?: string }>
        inline?: Array<{ sys: { id: string }; __typename?: string }>
      }
    }
  }
}
/* -------------------------------------------------------------------------- */
/*  Fetch GraphQL with optional cache tags                                    */
/* -------------------------------------------------------------------------- */
export async function fetchGraphQL<T, V extends object = object>(
  query: string,
  variables?: V,
  tags?: string[]
): Promise<T> {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
      ...(tags ? { next: { tags } } : {}),
    }
  )

  const json = await response.json()
  if (json.errors) {
    console.error("Contentful GraphQL errors", JSON.stringify(json.errors))
    throw new Error("Failed to fetch data from Contentful")
  }

  return json.data as T
}

/* -------------------------------------------------------------------------- */
/*  Helper Functions                                                          */
/* -------------------------------------------------------------------------- */
export async function getAllSlugs(): Promise<string[]> {
  const data = await fetchGraphQL<{
    blogPostCollection: { items: { slug: string | null }[] }
  }>(GET_BLOG_POSTS, undefined, ["blog-posts"])

  return data.blogPostCollection.items
    .map((item) => item.slug)
    .filter(Boolean) as string[]
}

export async function getPostBySlug(
  slug: string
): Promise<ContentfulBlogPost | null> {
  const data = await fetchGraphQL<{
    blogPostCollection: { items: ContentfulBlogPost[] }
  }>(GET_BLOG_POST, { slug }, ["blog-posts", `post-${slug}`])

  return data.blogPostCollection.items[0] ?? null
}

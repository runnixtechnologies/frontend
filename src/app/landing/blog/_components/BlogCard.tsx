"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ContentfulBlogPost } from "@/lib/contentful"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function BlogCards({ posts }: { posts: ContentfulBlogPost[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 6
  const totalPages = Math.ceil(posts.length / blogsPerPage)

  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const currentBlogs = posts.slice(indexOfFirstBlog, indexOfLastBlog)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  function BlogCard({ post }: { post: ContentfulBlogPost }) {
    console.log("post", post)
    return (
      <Link
        href={`/landing/blog/${post.slug}`}
        className="bg-white flex flex-col gap-[20px] pt-4 pb-5 px-4 rounded-[16px] border border-solid dark:border-[#EBEBEC] border-[#E4E3E5] shadow-none transform hover:scale-[1.01] transition-all duration-300 cursor-pointer"
      >
        <Image
          src={
            post.heroImage?.url?.startsWith("//")
              ? `https:${post.heroImage.url}`
              : post.heroImage?.url || "/fallback.jpg"
          }
          alt={post.heroImage?.description || post.title}
          width={338}
          height={240}
          className="w-full h-[240px] rounded-[8px] object-cover object-center"
        />
        <h4 className="font-figtree font-bold text-[#232323] text-[20px] leading-[120%] -tracking-[2%]">
          {post.title}
        </h4>
        <p className="font-metrophobic font-normal text-[16px] leading-[120%] text-[#7C7C7C] -tracking-[2%]">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center text-sm">
          <p className="font-figtree font-semibold text-[#232323]">
            {post.author?.name}
          </p>
          <p className="text-[#7C7C7C]">
            {new Intl.DateTimeFormat("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(post.publishDate))}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <section className="w-full bg-white/50 dark:bg-[#1D192B] flex flex-col items-center py-10 lg:py-20 px-4 2xl:px-0">
      <div className="w-full 2xl:w-[1184px] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[36px] mb-10">
        {currentBlogs.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>

      <Pagination className="mt-6">
        <PaginationContent className="flex gap-[32px]">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) handlePageChange(currentPage - 1)
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {pageNumbers.map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href="#"
                isActive={currentPage === number}
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(number)
                }}
                className={
                  currentPage === number
                    ? "text-white"
                    : "text-[#4F4B5C] dark:text-white/50"
                }
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) handlePageChange(currentPage + 1)
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  )
}

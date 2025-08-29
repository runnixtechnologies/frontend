import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"

function Pagination(props: React.ComponentProps<"nav">) {
  return <nav aria-label="pagination" data-slot="pagination" {...props} />
}

function PaginationContent(props: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" {...props} />
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  href: string
  isActive?: boolean
  disabled?: boolean
  size?: React.ComponentProps<typeof Button>["size"]
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children: React.ReactNode
}

function PaginationLink({
  href,
  isActive = false,
  disabled = false,
  size = "icon",
  className,
  onClick,
  children,
}: PaginationLinkProps) {
  // Disabled → render as span
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          buttonVariants({ variant: isActive ? "default" : "ghost", size }),
          "opacity-50 pointer-events-none",
          className
        )}
      >
        {children}
      </span>
    )
  }

  // Enabled → Next.js Link
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "ghost", size }),
        className
      )}
    >
      {children}
    </Link>
  )
}

function PaginationPrevious(props: Omit<PaginationLinkProps, "children">) {
  return (
    <PaginationLink
      {...props}
      className={cn("w-10 h-10 rounded-xl p-2", props.className)}
    >
      <ChevronLeftIcon />
    </PaginationLink>
  )
}

function PaginationNext(props: Omit<PaginationLinkProps, "children">) {
  return (
    <PaginationLink
      {...props}
      className={cn("w-10 h-10 rounded-xl p-2", props.className)}
    >
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis(props: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" {...props}>
      <MoreVerticalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

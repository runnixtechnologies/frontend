"use client"

import type React from "react"
import {
  AddShopIcon,
  CircledCheck,
  RemoveProfile,
  RemoveShopIcon,
  SuspendIcon,
  TickeIcon,
} from "@/components/svgs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useMemo, useState } from "react"

// --- Types that match your backend sample ---
export type AdminActivityLog = {
  id: number
  admin_id: number
  name: string
  email: string
  action:
    | "login"
    | "reset-password"
    | "invite-member"
    | "admin-role-updated"
    | "admins-status-updated"
    | string
  target: string | null
  target_reference: string | null
  data: string // serialized JSON (may be "[]")
  status: number
  created_at: string
  updated_at: string
}

export function AdminActivityLogs({ logs = [] as AdminActivityLog[] }) {
  // ------ Map backend logs → UI rows ------
  const items = useMemo(() => {
    return (logs ?? []).map((log) => {
      // Choose an icon + colors + main text per action
      let icon: React.ReactNode = <TickeIcon />
      let iconBg = "bg-[#F7F6FC] text-[#232323]"
      let text = ""
      let highlight = ""
      let suffix = ""

      const ref = log.target_reference ?? ""
      const action = (log.action || "").toLowerCase()

      switch (action) {
        case "login":
          icon = <CircledCheck />
          iconBg = "bg-[#EEFFF1] text-[#01B833]"
          text = "Logged in"
          highlight = log.name || log.email || ""
          suffix = ""
          break
        case "reset-password":
          icon = <CircledCheck />
          iconBg = "bg-[#EEFFF1] text-[#01B833]"
          text = "Reset password for"
          highlight = log.name || log.email || ""
          suffix = ""
          break

        case "invite-member":
          icon = <AddShopIcon />
          iconBg = "bg-[#EEFFF1] text-[#01B833]"
          text = "Invited member"
          highlight = ref ? `#${ref}` : ""
          suffix = ""
          break

        case "admin-role-updated":
          icon = <TickeIcon />
          iconBg = "bg-[#FFE2D4] text-[#FE6139]"
          text = "Updated admin role"
          highlight = ref ? `#${ref}` : ""
          suffix = ""
          break

        case "admins-status-updated":
          icon = <SuspendIcon />
          iconBg = "bg-[#FFE1E1] text-[#F83B3B]"
          text = "Updated admin status"
          highlight = ref ? `#${ref}` : ""
          suffix = ""
          break
        case "delete":
          icon = <RemoveProfile />
          iconBg = "bg-[#FFE1E1] text-[#F83B3B]"
          text = "Deleted"
          highlight = log.name || log.email || ""
          suffix = ""
          break
        case "rejected":
          icon = <RemoveShopIcon />
          iconBg = "bg-[#FFE1E1] text-[#F83B3B]"
          text = "Rejected Merchant"
          highlight = log.name || log.email || ""
          suffix = ""
          break
        default:
          icon = <TickeIcon />
          iconBg = "bg-[#F7F6FC] text-[#232323]"
          text = action.replace(/-/g, " ") || "Action"
          highlight = ref ? `#${ref}` : ""
          suffix = ""
          break
      }

      // Format time (simple fallback – use created_at as “time ago”/date)
      const time = new Date(log.created_at).toLocaleString()

      return {
        id: log.id,
        icon,
        iconBg,
        text,
        highlight,
        suffix,
        time,
      }
    })
  }, [logs])

  // ------ Pagination ------
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

  const start = (currentPage - 1) * itemsPerPage
  const pageItems = items.slice(start, start + itemsPerPage)

  const changePage = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p))
    setCurrentPage(next)
    document
      .querySelector(".rounded-md.border")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-col items-center xl:flex-row gap-2 h-[96px] pt-6 pb-5 px-6 justify-between">
        <h2 className="text-[#191A1A] font-figtree font-bold text-[24px]/[32px] -tracking-[2%]">
          Activity logs
        </h2>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          {pageItems.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No activity yet.
            </div>
          ) : (
            <div className="space-y-0">
              {pageItems.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Connecting line */}
                  {index < pageItems.length - 1 && (
                    <div className="absolute left-4 top-8 w-px h-8 bg-[#DCDCDC]" />
                  )}

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${item.iconBg} relative z-10`}
                      >
                        {item.icon}
                      </div>
                      <div className="text-[#232323] font-figtree font-normal text-[16px]/[160%] -tracking-[2%]">
                        {item.text}{" "}
                        {item.highlight && (
                          <span className="text-primary font-bold">
                            {item.highlight}
                          </span>
                        )}
                        {item.suffix && (
                          <span className="font-bold"> {item.suffix}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-[#7C7C7C] font-medium font-figtree text-[12px]/[120%] tracking-normal">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center py-4">
            <Pagination>
              <PaginationContent className="flex gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      changePage(currentPage - 1)
                    }}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {pages.map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink
                      href="#"
                      isActive={n === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        changePage(n)
                      }}
                      size="icon"
                    >
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      changePage(currentPage + 1)
                    }}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

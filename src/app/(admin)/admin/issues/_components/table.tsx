// src/app/(admin)/admin/issues/_components/table.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getInitials } from "@/lib/utils"
import ReplyMessage from "./message"
import type { IssuesProps } from "../page"
import type { IssueFilterValues } from "./filters"

import {
  useAssignIssueRoleMutation,
  useUpdateIssueStatusMutation,
  type IssueStatus,
} from "@/lib/redux/api/issues"
import { useGetRolesQuery } from "@/lib/redux/api/utils"

/** Role shapes from your utils slice (same as you used elsewhere) */
type Permission = {
  id: number
  name: string
  code: string
  status: number
  created_at: string
  updated_at: string
}
type RolePermissionPivot = {
  id: number
  role_id: number
  permission_id: number
  status: number
  created_at: string
  updated_at: string
  permission: Permission
}
type Role = {
  id: number
  name: string
  code: string
  status: number
  created_at: string
  updated_at: string
  permissions: RolePermissionPivot[]
}
type GetRolesResponse = {
  status: string
  message: string
  data: { roles: Role[]; permissions: Permission[] }
  errors: unknown[]
}

const STATUS_OPTIONS: IssueStatus[] = ["Pending", "InProgress", "Resolved"]

function statusClasses(value: IssueStatus) {
  return value === "Resolved"
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : value === "InProgress"
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-gray-100 text-gray-700 border-gray-200"
}

interface IssuesTableProps {
  filters?: IssueFilterValues
  data?: IssuesProps[]
}

export function IssuesTable({ filters, data = [] }: IssuesTableProps) {
  const [filtered, setFiltered] = useState(data)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // --- Optimistic role state: issue.id -> roleId (string)
  const [roleMap, setRoleMap] = useState<Record<string | number, string>>({})

  // Roles list
  const { data: rolesResp } = useGetRolesQuery(undefined)
  const roles: Role[] = useMemo(
    () => (rolesResp as GetRolesResponse | undefined)?.data?.roles ?? [],
    [rolesResp]
  )

  // Mutations
  const [updateStatus] = useUpdateIssueStatusMutation()
  const [assignRole] = useAssignIssueRoleMutation()

  // Seed roleMap from incoming data; preserve any user-chosen values
  useEffect(() => {
    const next: Record<string | number, string> = {}
    for (const row of data) {
      const fromProp =
        (row as any).assigned_role_id != null
          ? String((row as any).assigned_role_id)
          : ""
      next[row.id] = roleMap[row.id] ?? fromProp
    }
    setRoleMap(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Apply filters and reset pagination
  useEffect(() => {
    let result = [...data]
    if (filters) {
      const { location, status, searchQuery } = filters

      if (location !== "all-locations") {
        const locMap: Record<string, number[]> = {
          north: [1, 5, 9, 13, 17, 21, 25, 29],
          south: [2, 6, 10, 14, 18, 22, 26, 30],
          east: [3, 7, 11, 15, 19, 23, 27],
          west: [4, 8, 12, 16, 20, 24, 28],
        }
        result = result.filter((d) => locMap[location]?.includes(d.id))
      }

      if (status.length > 0) {
        result = result.filter((d) => status.includes(d.status))
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        result = result.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.sender.toLowerCase().includes(q)
        )
      }
    }

    setFiltered(result)
    setCurrentPage(1)
  }, [filters, data])

  // Pagination
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / itemsPerPage)),
    [filtered.length]
  )
  const start = (currentPage - 1) * itemsPerPage
  const pageItems = filtered.slice(start, start + itemsPerPage)
  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  )

  const changePage = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p))
    setCurrentPage(next)
    document
      .querySelector(".rounded-md.border")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // --- Handlers
  const handleStatusChange = async (id: number | string, next: IssueStatus) => {
    try {
      await updateStatus({ id, status: next }).unwrap()
      // Optional: optimistically update filtered array's status to avoid waiting for refetch
      setFiltered((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: next } : r))
      )
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const handleRoleAssign = async (id: number | string, roleId: string) => {
    const prev = roleMap[id]
    // optimistic
    setRoleMap((m) => ({ ...m, [id]: roleId }))
    try {
      await assignRole({ id, roleId }).unwrap()
      // Optionally reflect on filtered data if you store assigned_role_id there
      setFiltered((prev) =>
        prev.map((r) =>
          r.id === id ? ({ ...r, assigned_role_id: Number(roleId) } as any) : r
        )
      )
    } catch {
      setRoleMap((m) => ({ ...m, [id]: prev }))
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#EFEFEF] py-3 px-6 border-0 border-t border-b border-[#F2F2F2]">
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Sender Name</TableHead>
                <TableHead>Account type</TableHead>
                <TableHead>Issue Category</TableHead>
                <TableHead>Order Id</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned to</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageItems.length > 0 ? (
                pageItems.map((issue) => {
                  const canAssign =
                    issue.status === "Pending" || issue.status === "InProgress"

                  const selectedRoleId =
                    roleMap[issue.id] ??
                    ((issue as any).assigned_role_id != null
                      ? String((issue as any).assigned_role_id)
                      : "")

                  return (
                    <TableRow key={issue.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex flex-col font-figtree font-semibold text-[12px]/[133%] -tracking-[2%]">
                          {issue.date}
                          <span className="text-[10px]/[133%] font-normal">
                            {issue.time}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={issue.imgUrl || "/placeholder.svg"}
                              alt="User"
                            />
                            <AvatarFallback>
                              {getInitials(issue.sender)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-figtree text-[12px]">
                            {issue.sender}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>{issue.type}</TableCell>
                      <TableCell>{issue.category}</TableCell>

                      <TableCell className="text-primary">
                        #{issue.orderId}
                      </TableCell>

                      <TableCell>
                        <ReplyMessage message={issue.message} />
                      </TableCell>

                      {/* Status as badge-like select */}
                      <TableCell>
                        <Select
                          value={issue.status}
                          onValueChange={(v: IssueStatus) =>
                            handleStatusChange(issue.id, v)
                          }
                        >
                          <SelectTrigger
                            className={`h-8 w-[140px] border ${statusClasses(
                              issue.status
                            )}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Role (only when Pending/InProgress) */}
                      <TableCell>
                        <Select
                          value={selectedRoleId}
                          onValueChange={(rid) =>
                            handleRoleAssign(issue.id, rid)
                          }
                          disabled={!canAssign}
                        >
                          <SelectTrigger
                            className={`h-8 w-[190px] ${
                              canAssign
                                ? "border border-primary"
                                : "opacity-60 pointer-events-none"
                            }`}
                          >
                            <SelectValue
                              placeholder={
                                canAssign ? "Assign role" : "Resolved"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {roles.length > 0 ? (
                                roles.map((r) => (
                                  <SelectItem key={r.id} value={String(r.id)}>
                                    {r.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  No roles available
                                </div>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No issues match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
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
      </div>
    </>
  )
}

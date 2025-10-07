"use client"

import { Guard } from "@/components/auth/Guard"
import { Button } from "@/components/ui/button"
import { useGetAllAdminsQuery } from "@/lib/redux/api/admin"
import { useEffect, useMemo, useState } from "react"
import { SearchComponent } from "../../_components/search-component"
import { AdminFilters, type AdminFilterValues } from "./_components/filters"
import { InviteAdmin } from "./_components/invite-member"
import { AdminTable } from "./_components/table"

export interface Admin {
  id: number
  name: string
  role: string
  roleCode: string
  imgUrl: string
  email: string
  status: "Active" | "Pending"
}

type ApiRole = { id: number; name: string; code: string }
type ApiAdmin = {
  id: number
  firstname: string
  lastname: string
  username: string | null
  email: string
  status: string
  photo: string | null
  role?: ApiRole
}
type GetAllAdminsResponse = {
  status: string
  message: string
  data: {
    current_page: number
    data: ApiAdmin[]
    total: number
    per_page: number
    last_page: number
  }
  errors: unknown[]
}

export default function AdminPage() {
  const {
    data: resp,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllAdminsQuery(undefined)

  const raw: ApiAdmin[] = useMemo(() => {
    const r = resp as GetAllAdminsResponse | ApiAdmin[] | undefined
    return (
      ((r as GetAllAdminsResponse | undefined)?.data?.data ??
        ((r as any)?.data as ApiAdmin[] | undefined) ??
        (Array.isArray(r) ? r : [])) ||
      []
    )
  }, [resp])

  const toLocal = (a: ApiAdmin): Admin => {
    const id = Number(a?.id ?? 0)
    const name =
      [a?.firstname, a?.lastname].filter(Boolean).join(" ") ||
      a?.username ||
      "—"
    const email = a?.email ?? "—"
    const role = a?.role?.name ?? a?.role?.code ?? "Member"
    const roleCode = (a?.role?.code ?? "member").toLowerCase()
    const imgUrl = a?.photo || "/images/riders/rider-1.jpg"
    const s = String(a?.status ?? "").toLowerCase()
    const status: Admin["status"] = s === "active" ? "Active" : "Pending"
    return { id, name, role, roleCode, imgUrl, email, status }
  }

  const admins: Admin[] = useMemo(() => raw.map(toLocal), [raw])

  const [filtered, setFiltered] = useState<Admin[]>([])
  const [filters, setFilters] = useState<AdminFilterValues>({
    type: "all-type",
    status: [],
    category: "", // will be "super-admin" | "admin" | "customer-support" | ""
    dateRange: "all-time",
    searchQuery: "",
  })

  useEffect(() => {
    let result = [...admins]

    // role filter
    if (filters.category) {
      const wanted = filters.category.toLowerCase()
      result = result.filter((d) => d.roleCode === wanted)
    }

    // status chips (Active/Pending)
    if (filters.status?.length) {
      const wanted = new Set(filters.status)
      result = result.filter((d) => wanted.has(d.status))
    }

    // search by name/email/role
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.role.toLowerCase().includes(q)
      )
    }

    setFiltered(result)
  }, [admins, filters])

  const handleSearchChange = (query: string) =>
    setFilters((prev) => ({ ...prev, searchQuery: query }))

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-lg border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
            <div className="h-64 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-lg border p-6">
          <p className="text-red-600 mb-3">
            Failed to load admins
            {(error as any)?.data?.message
              ? `: ${(error as any).data.message}`
              : "."}
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <Guard allow={["super-admin", "admin", "customer-support"]}>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="w-full bg-white rounded-lg border flex flex-col gap-3">
          <div className="w-full flex justify-between gap-2 pt-6 pb-5 px-6">
            <h3 className="font-figtree font-bold text-[24px]/[32px] text-[#313335] -tracking-[2%]">
              {filtered.length} Members
            </h3>
            <div className="flex gap-2">
              <SearchComponent
                onSearch={handleSearchChange}
                placeholder="Search"
              />
              {/* ✅ Wire filter changes */}
              <AdminFilters onFilterChange={setFilters} />
              <InviteAdmin />
            </div>
          </div>
          <AdminTable filters={filters} data={filtered} />
        </div>
      </div>
    </Guard>
  )
}

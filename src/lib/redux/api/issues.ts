import { baseApi } from "./baseApi"

/* ---------- Domain types ---------- */
export type IssueStatus = "Pending" | "InProgress" | "Resolved"
export type IssueRole = "super-admin" | "admin" | "customer-support"

/** Raw issue from backend (keep wide/optional to be resilient) */
export type ApiIssue = {
  id: number | string
  status?: IssueStatus | string | number
  role?: IssueRole | string | null
  // Common fields you showed in the UI
  sender?: string
  type?: string
  category?: string
  order_id?: string | number | null
  message?: string | null
  // Timestamps (various shapes)
  date?: string | null
  time?: string | null
  created_at?: string | null
  updated_at?: string | null
  // Images / avatars
  img_url?: string | null
  avatar?: string | null
  // Sometimes nested
  user?: { name?: string; avatar?: string | null } | null
  // Anything else…
  [k: string]: any
}

/** UI Issue shape (matches your table/page) */
export type Issue = {
  id: number | string
  name: string
  date: string
  time: string
  sender: string
  type: string
  category: string
  message: string
  orderId: string
  imgUrl: string
  status: IssueStatus
  role?: IssueRole | null
}

/* ---------- Envelopes ---------- */
type Envelope<T> = {
  status?: string
  message?: string
  data?: T
  errors?: unknown[]
}

type Paginated<T> = {
  data: T[]
  current_page?: number
  per_page?: number
  total?: number
  last_page?: number
  next_page_url?: string | null
  prev_page_url?: string | null
}

/* ---------- List args ---------- */
export type GetIssuesArgs = {
  page?: number
  per_page?: number
  status?: IssueStatus | "all"
  role?: IssueRole
  search?: string
  type?: string
  category?: string
  date_from?: string
  date_to?: string
}

/* ---------- Helpers ---------- */
function normalizeStatus(raw?: unknown): IssueStatus {
  const v = String(raw ?? "").toLowerCase()
  if (v === "resolved" || v === "2" || v === "success") return "Resolved"
  if (v === "inprogress" || v === "in_progress" || v === "1")
    return "InProgress"
  return "Pending"
}

function pickDateParts(issue: ApiIssue): { date: string; time: string } {
  // Prefer explicit date/time if provided
  if (issue.date || issue.time) {
    return {
      date: String(issue.date ?? ""),
      time: String(issue.time ?? ""),
    }
  }
  // Else derive from created_at
  const iso = issue.created_at ?? ""
  if (iso) {
    const d = new Date(iso)
    return {
      date: d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
      time: d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }
  return { date: "", time: "" }
}

function toIssue(x: ApiIssue): Issue {
  const { date, time } = pickDateParts(x)
  const sender =
    x.sender ||
    x.user?.name ||
    x.name ||
    x.customer_name ||
    x.merchant_name ||
    "—"
  const imgUrl = x.img_url || x.avatar || x.user?.avatar || ""
  const orderId = x.order_id != null ? String(x.order_id) : ""
  return {
    id: x.id,
    name: x.name || x.type || "—",
    date,
    time,
    sender,
    type: x.type || "—",
    category: x.category || x.issue_category || "—",
    message: x.message || x.description || "",
    orderId,
    imgUrl,
    status: normalizeStatus(x.status),
    role: (x.role as IssueRole) ?? null,
  }
}

/* ---------- API slice ---------- */
export const issuesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /* Get ALL issues (supports both paginated + plain-array responses) */
    getIssues: b.query<
      {
        rows: Issue[]
        page: number
        perPage: number
        total: number
        lastPage: number
      },
      GetIssuesArgs | void
    >({
      query: (q) => ({
        url: "/issues",
        method: "GET",
        params: {
          page: q?.page,
          per_page: q?.per_page,
          status: q?.status && q.status !== "all" ? q.status : undefined,
          role: q?.role,
          search: q?.search,
          type: q?.type,
          category: q?.category,
          date_from: q?.date_from,
          date_to: q?.date_to,
        },
      }),
      transformResponse: (
        res:
          | Envelope<ApiIssue[] | Paginated<ApiIssue>>
          | ApiIssue[]
          | Paginated<ApiIssue>
      ) => {
        // unwrap envelopes
        const payload =
          (res as Envelope<ApiIssue[] | Paginated<ApiIssue>>)?.data ?? res

        // paginated?
        if (
          payload &&
          typeof payload === "object" &&
          "data" in (payload as any)
        ) {
          const p = payload as Paginated<ApiIssue>
          const rows = (p.data ?? []).map(toIssue)
          return {
            rows,
            page: Number(p.current_page ?? 1),
            perPage: Number(p.per_page ?? rows.length),
            total: Number(p.total ?? rows.length),
            lastPage: Number(p.last_page ?? 1),
          }
        }

        // plain array
        const list = (payload as ApiIssue[]) ?? []
        const rows = list.map(toIssue)
        return {
          rows,
          page: 1,
          perPage: rows.length,
          total: rows.length,
          lastPage: 1,
        }
      },
      providesTags: (result) => [
        { type: "Issues" as const, id: "LIST" },
        ...(result?.rows ?? []).map((r) => ({
          type: "Issues" as const,
          id: String(r.id),
        })),
      ],
    }),

    /* Get SINGLE issue */
    getIssue: b.query<Issue, number | string>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: "GET",
      }),
      transformResponse: (res: Envelope<ApiIssue> | ApiIssue) =>
        toIssue((res as Envelope<ApiIssue>)?.data ?? (res as ApiIssue)),
      providesTags: (_res, _err, id) => [{ type: "Issues", id: String(id) }],
    }),

    /* Update status (existing from earlier message) */
    updateIssueStatus: b.mutation<
      ApiIssue,
      { id: number | string; status: IssueStatus }
    >({
      query: ({ id, status }) => ({
        url: `/issues/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      transformResponse: (res: Envelope<ApiIssue> | ApiIssue) =>
        (res as Envelope<ApiIssue>)?.data ?? (res as ApiIssue),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Issues", id: "LIST" },
        { type: "Issues", id: String(arg.id) },
      ],
    }),
    assignIssueRole: b.mutation<
      ApiIssue,
      { id: string | number; roleId: string | number }
    >({
      query: ({ id, roleId }) => ({
        url: `/issues/${id}/assignee-role`,
        method: "PUT",
        body: { role_id: roleId },
      }),
    }),
  }),
})

export const {
  useGetIssuesQuery,
  useGetIssueQuery,
  useUpdateIssueStatusMutation,
  useAssignIssueRoleMutation,
} = issuesApi

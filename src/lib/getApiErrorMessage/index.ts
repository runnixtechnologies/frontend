// getApiErrorMessage.ts
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { SerializedError } from "@reduxjs/toolkit"

type ErrorBody =
  | { message?: string; error?: string; detail?: string; errors?: string[] }
  | string
  | undefined

function isFetchBaseQueryError(e: unknown): e is FetchBaseQueryError {
  return typeof e === "object" && e !== null && "status" in e
}

export function getApiErrorMessage(error: unknown): string {
  if (!error) return ""

  if (isFetchBaseQueryError(error)) {
    const data = (error as FetchBaseQueryError).data as ErrorBody
    if (typeof data === "string") return data
    return (
      data?.message ??
      data?.error ??
      data?.detail ??
      (Array.isArray(data?.errors) ? data.errors.join(", ") : undefined) ??
      `Request failed (${error.status})`
    )
  }

  const se = error as SerializedError
  return se.message ?? "Something went wrong."
}

"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateAdminStatusMutation } from "@/lib/redux/api/admin"
import { ChevronDown } from "lucide-react"

type UiStatus = "active" | "suspend" | "delete"

function mapUiToApiStatus(s: UiStatus): "active" | "suspended" | "deleted" {
  if (s === "suspend") return "suspended"
  if (s === "delete") return "deleted"
  return "active"
}

export function StatusDialog({
  adminId,
  currentStatus = "active",
  onUpdated,
}: {
  adminId: number
  currentStatus?: string
  onUpdated?: () => void
}) {
  const initialUiStatus: UiStatus = useMemo(() => {
    const s = String(currentStatus).toLowerCase()
    if (s === "suspended") return "suspend"
    if (s === "deleted") return "delete"
    return "active"
  }, [currentStatus])

  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<UiStatus>(initialUiStatus)
  const [remarks, setRemarks] = useState("")
  const [updateAdminStatus, { isLoading }] = useUpdateAdminStatusMutation()

  const needsRemarks = status === "suspend" || status === "delete"

  async function handleSave() {
    const apiStatus = mapUiToApiStatus(status)

    if (
      (apiStatus === "suspended" || apiStatus === "deleted") &&
      !remarks.trim()
    ) {
      alert("Please add a remark for suspended/deleted status.")
      return
    }

    await updateAdminStatus({
      admin_id: adminId,
      status: apiStatus,
      remarks: remarks.trim() || "",
    }).unwrap()

    setOpen(false)
    setRemarks("")
    onUpdated?.()
  }

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (v) {
      setStatus(initialUiStatus)
      setRemarks("")
    }
  }

  // --- Badge styles ---
  const badgeClasses: Record<UiStatus, string> = {
    active:
      "bg-[#EEFFF1] text-[#01B833] hover:bg-[#d9fbe0] hover:text-[#01B833]/50 border border-[#01B833]",
    suspend:
      "bg-[#FFF7E0] text-[#E6A100] hover:bg-[#ffefc2] hover:text-[#E6A100]/50 border border-[#E6A100]",
    delete:
      "bg-[#FFE1E1] text-[#F83B3B] hover:bg-[#ffd6d6] hover:text-[#E6A100]/50 border border-[#F83B3B]",
  }

  const label: Record<UiStatus, string> = {
    active: "Active",
    suspend: "Suspended",
    delete: "Deleted",
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badgeClasses[status]}`}
        >
          {label[status]}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Update Admin Status</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as UiStatus)}
            >
              <SelectTrigger className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspend">Suspend</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsRemarks && (
            <div className="grid gap-2">
              <Label>Remarks</Label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. You have commited a <b>non-chalanct</b> attitude"
                className="min-h-10 pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
              />
              <p className="text-xs text-muted-foreground">
                A remark is required when suspending or deleting an admin.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Updating..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

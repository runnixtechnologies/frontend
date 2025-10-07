"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateUserStatusMutation } from "@/lib/redux/api/users"

type UiStatus = "1" | "0" | "-1" // 1=active, 0=inactive, -1=suspended

// UI -> API (same string value)
function uiToApiStatus(s: UiStatus): "1" | "0" | "-1" {
  return s
}

// badge colors per status
function getBadgeStyles(s: UiStatus) {
  switch (s) {
    case "1": // active
      return "bg-[#EEFFF1] text-[#01B833] hover:bg-[#EEFFF1]/80"
    case "0": // inactive
      return "bg-[#EFEFEF] text-[#656565] hover:bg-[#EFEFEF]/80"
    case "-1": // suspended
      return "bg-[#FFE1E1] text-[#F83B3B] hover:bg-[#FFE1E1]/80"
    default:
      return "bg-[#EFEFEF] text-[#656565]"
  }
}

// human label for the pill
function statusLabel(s: UiStatus) {
  if (s === "1") return "Active"
  if (s === "0") return "Inactive"
  return "Suspended" // "-1"
}

export function UserStatusButton({
  userId,
  currentStatus = "1",
  onUpdated,
}: {
  userId: number
  /** can be "1" | "0" | "-1" or "active" | "inactive" | "suspended" */
  currentStatus?: string
  onUpdated?: () => void
}) {
  // normalize any input to our UiStatus union
  const initialUiStatus: UiStatus = useMemo(() => {
    const s = String(currentStatus).toLowerCase()
    if (s === "-1" || s === "suspended") return "-1"
    if (s === "0" || s === "inactive") return "0"
    return "1"
  }, [currentStatus])

  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<UiStatus>(initialUiStatus)

  // keep pill in sync if parent updates currentStatus after a mutation
  useEffect(() => {
    setStatus(initialUiStatus)
  }, [initialUiStatus])

  const [updateUserStatus, { isLoading }] = useUpdateUserStatusMutation()

  async function handleSave() {
    const apiStatus = uiToApiStatus(status)
    await updateUserStatus({
      user_id: userId,
      status: apiStatus,
      userType: "user",
    }).unwrap()

    setOpen(false)
    onUpdated?.()
  }

  function handleOpen(v: boolean) {
    setOpen(v)
    if (v) setStatus(initialUiStatus)
  }

  return (
    <>
      <Button
        type="button"
        className={`h-[28px] py-1 px-2 rounded-full font-figtree text-[14px]/[120%] ${getBadgeStyles(
          status
        )} flex items-center gap-1`}
        onClick={() => handleOpen(true)}
      >
        <span className="capitalize">{statusLabel(status)}</span>
        <ChevronDown className="w-3 h-3" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Update User Status</DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as UiStatus)}
              >
                <SelectTrigger className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#7C7C7C]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                  <SelectItem value="-1">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
    </>
  )
}

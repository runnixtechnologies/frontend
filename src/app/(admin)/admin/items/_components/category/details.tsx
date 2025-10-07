// src/app/(admin)/admin/items/_components/category/details.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Trash2 } from "lucide-react"
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
} from "@/lib/redux/api/category"
import { Badge } from "@/components/ui/badge"
import { getImageUrl } from "@/lib/cdn"

type CategoryDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: number | string
  categoryName?: string
  categoryImage?: string | null
  description?: string | null
  storeType?: string
  /** pass current status if you have it; defaults to "active" */
  status?: "active" | "inactive"

  onSaved?: () => void
  onDeleted?: () => void
}

export function CategoryDetails({
  open,
  onOpenChange,
  categoryId,
  categoryName = "Category",
  categoryImage = "/images/shopping-basket.png",
  description = "",
  storeType = "—",
  status = "active",
  onSaved,
  onDeleted,
}: CategoryDetailsDialogProps) {
  const [name, setName] = useState(categoryName)
  const [desc, setDesc] = useState(description ?? "")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(status === "active")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [updateCategory, { isLoading: isSaving }] = useUpdateCategoryMutation()
  const [updateCategoryStatus, { isLoading: isUpdatingStatus }] =
    useUpdateCategoryStatusMutation()
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation()

  useEffect(() => {
    if (open) {
      setName(categoryName)
      setDesc(description ?? "")
      setIsActive(status === "active")
      setFile(null)
      setPreview(null)
      setError(null)
    }
  }, [open, categoryName, description, status])

  const imgSrc = useMemo(() => {
    if (preview) return preview // replaces backend instantly
    const full = categoryImage ? getImageUrl(categoryImage) : ""
    try {
      return full ? new URL(full).toString() : ""
    } catch {
      return ""
    }
  }, [preview, categoryImage])

  function loadPreview(f: File) {
    const reader = new FileReader()
    reader.onload = (e) => setPreview((e.target?.result as string) || null)
    reader.readAsDataURL(f)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (png, jpg, etc.)")
      return
    }
    setError(null)
    setFile(f)
    loadPreview(f)
  }

  function triggerPick() {
    fileInputRef.current?.click()
  }

  async function handleSave() {
    if (!String(name).trim()) {
      setError("Category name is required")
      return
    }
    setError(null)
    try {
      const body: any = { id: categoryId, name, description: desc }
      if (file) body.image = file
      await updateCategory(body).unwrap()
      onSaved?.()
      onOpenChange(false)
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "Failed to update category."
      setError(msg)
    }
  }

  async function handleDelete() {
    try {
      await deleteCategory(categoryId).unwrap()
      onDeleted?.()
      onOpenChange(false)
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "Failed to delete category."
      setError(msg)
    }
  }

  async function handleStatusUpdate() {
    try {
      const newStatus = isActive ? "inactive" : "active"
      await updateCategoryStatus({ id: categoryId, status: newStatus }).unwrap()
      setIsActive(newStatus === "active")
      onSaved?.()
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || "Failed to update status."
      setError(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-black font-bold text-[28px]/[120%]">
            Category Details
          </DialogTitle>
          <p className="font-figtree text-sm text-[#525252]">
            From {storeType}
          </p>
        </DialogHeader>
        {/* Status */}
        <div className="flex items-center justify-end rounded-lg border p-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleStatusUpdate}
            disabled={isUpdatingStatus}
            className="h-8"
          >
            {isUpdatingStatus
              ? "Updating..."
              : isActive
              ? "Set Inactive"
              : "Set Active"}
          </Button>
        </div>
        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label
              htmlFor="categoryName"
              className="font-figtree text-[10px]/[140%] text-[#525252]"
            >
              Category Name{" "}
              <Badge
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isActive
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="categoryDesc"
              className="font-figtree text-[10px]/[140%] text-[#525252]"
            >
              Description
            </Label>
            <Input
              id="categoryDesc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Add a short description"
              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <div className="min-h-[240px] bg-[#EFEFEF] rounded-[12px] py-6 flex flex-col items-center justify-center border border-[#DCDCDC]">
              {imgSrc ? (
                <Image
                  src={imgSrc || "/placeholder.svg"}
                  alt={name || "Category image"}
                  width={220}
                  height={220}
                  className="max-w-full max-h-40 object-contain mb-4"
                  unoptimized={imgSrc.startsWith("data:")}
                />
              ) : (
                <div className="w-12 h-12 bg-muted-foreground/10 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </div>
              )}

              <input
                ref={fileInputRef}
                id="categoryImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />

              <Button
                type="button"
                variant="outline"
                onClick={triggerPick}
                className="w-fit h-6 p-2 rounded-[24px] bg-[#232323] hover:bg-[#232323]/80 text-white border-0"
              >
                Change Picture
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-[51px] rounded-[12px] font-bold"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={handleDelete}
              className="w-full h-[51px] rounded-[12px] font-bold flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

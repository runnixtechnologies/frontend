"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getImageUrl } from "@/lib/cdn"
import {
  useDeleteStoreTypeMutation,
  useGetSingleStoreTypeQuery,
  useUpdateStoreTypeMutation,
} from "@/lib/redux/api/storeType"
import { DialogTitle } from "@radix-ui/react-dialog"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  storeTypeId: number | string
  onSaved?: () => void
  onDeleted?: () => void
}

export function StoreDetails({
  open,
  onOpenChange,
  storeTypeId,
  onSaved,
  onDeleted,
}: Props) {
  const { data } = useGetSingleStoreTypeQuery(storeTypeId, {
    skip: !open,
  })

  const [updateStoreType, { isLoading: isSaving }] =
    useUpdateStoreTypeMutation()
  const [deleteStoreType, { isLoading: isDeleting }] =
    useDeleteStoreTypeMutation()
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    image_url: "",
  })

  // Reset fields when dialog opens with fresh data
  useEffect(() => {
    if (data && open) {
      setFile(null)
      setPreviewDataUrl(null)
      setStoreData({
        name: data.name,
        description: data.description ?? "",
        image_url: data.image_url ?? "",
      })
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }, [data, open])

  const displaySrc = useMemo(() => {
    if (previewDataUrl) return previewDataUrl // replaces backend instantly
    const full = storeData.image_url ? getImageUrl(storeData.image_url) : ""
    try {
      return full ? new URL(full).toString() : ""
    } catch {
      return ""
    }
  }, [previewDataUrl, storeData.image_url])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputEl = e.currentTarget
    const f = inputEl.files?.[0]
    if (!f || !f.type.startsWith("image/")) return

    // allow re-selecting the same file
    inputEl.value = ""

    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreviewDataUrl(ev.target?.result as string) // shows immediately
      setFile(f) // remember file for upload
    }
    reader.readAsDataURL(f)
  }

  async function handleSave() {
    try {
      await updateStoreType({
        id: storeTypeId,
        name: storeData.name,
        description: storeData.description,
        image: file ?? undefined,
        image_url: file ? undefined : storeData.image_url ?? null,
      }).unwrap()

      onSaved?.()
      onOpenChange(false)
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        "Failed to create category. Please try again."
      setError(msg)
    }
  }
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this store type?")) return
    try {
      await deleteStoreType(storeTypeId).unwrap()
      onDeleted?.()
      onOpenChange(false)
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-h-[648px] sm:max-w-md font-figtree">
        <DialogHeader>
          <DialogTitle className="text-[#232323] font-bold text-[28px]/[120%]">
            Store Details
          </DialogTitle>
          <p className="font-figtree text-sm text-[#525252]">
            Manage your store information and settings
          </p>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="storeName"
                className="font-figtree text-[10px]/[140%] text-[#525252]"
              >
                Store Name
              </Label>

              <Input
                id="storeName"
                value={storeData.name}
                onChange={(e) =>
                  setStoreData({ ...storeData, name: e.target.value })
                }
                className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
              />
            </div>

            <div>
              <Label htmlFor="storeDesc" className="text-xs text-[#525252]">
                Description
              </Label>
              <Input
                id="storeDesc"
                value={storeData.description}
                onChange={(e) =>
                  setStoreData({
                    ...storeData,
                    description: e.target.value,
                  })
                }
                className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
              />
            </div>

            {/* Image + uploader */}
            <div className="flex flex-col gap-2">
              {displaySrc && (
                <Image
                  key={displaySrc}
                  src={displaySrc || "/placeholder.svg"}
                  alt={storeData.name || "Store image"}
                  width={200}
                  height={200}
                  className="object-contain rounded border"
                  unoptimized={displaySrc.startsWith("data:")}
                />
              )}
              <input
                ref={fileInputRef}
                id="storeImageUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="w-fit h-6 p-2 rounded-[24px] bg-[#232323] hover:bg-[#232323]/80 text-white border-0"
              >
                {file ? "Change Picture" : "Upload New Picture"}
              </Button>
            </div>
          </div>
          {error && (
            <div className="text-sm text-destructive p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-[51px] rounded-[12px] px-5 py-3 font-bold text-[16px]"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full h-[51px] rounded-[12px] px-5 py-3 font-bold text-[16px]"
            >
              {isDeleting ? "Deleting..." : "Delete Store"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

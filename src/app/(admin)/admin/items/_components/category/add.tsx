// src/app/(admin)/admin/items/_components/category/add.tsx
"use client"

import { ImageIcon } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { useCreateCategoryMutation } from "@/lib/redux/api/category"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Human-readable name of the store type (for the subtitle) */
  storeTypeName?: string
  /** Required for submission */
  storeTypeId?: number | string
  /** Optional: called after successful creation (e.g. to refresh parent) */
  onCreated?: (categoryId: string | number) => void // ← allow string or number
}

export function AddCategory({
  open,
  onOpenChange,
  storeTypeName = "—",
  storeTypeId,
  onCreated,
}: Props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [preview, setPreview] = useState<string | null>(null) // base64 preview
  const [file, setFile] = useState<File | null>(null) // real File for FormData
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createCategory, { isLoading: isSubmitting }] =
    useCreateCategoryMutation()

  function resetForm() {
    setName("")
    setDescription("")
    setPreview(null)
    setFile(null)
    setError(null)
  }

  function readFileForPreview(f: File) {
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0]
    if (f && f.type.startsWith("image/")) {
      setFile(f)
      readFileForPreview(f)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith("image/")) {
      setFile(f)
      readFileForPreview(f)
    }
  }

  const handleChangeImage = () => {
    const input = document.getElementById(
      "categoryImageUpload"
    ) as HTMLInputElement
    input?.click()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      setError("Category name is required")
      return
    }
    if (!storeTypeId) {
      setError("Missing store type id")
      return
    }

    setError(null)
    try {
      const created = await createCategory({
        name,
        description: description || "",
        image: file ?? undefined, // ← omit when no file
        store_type_id: storeTypeId,
      }).unwrap()

      onCreated?.(created.id) // ← created.id is string in your slice

      resetForm()
      onOpenChange(false)
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        "Failed to create category. Please try again."
      setError(msg)
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#232323] font-bold text-[28px]/[120%]">
            New Category
          </DialogTitle>
          <p className="font-figtree text-sm text-[#525252]">
            Adding to <strong>{storeTypeName}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label
              htmlFor="categoryName"
              className="font-figtree text-[10px]/[140%] text-[#525252]"
            >
              Category Name
            </Label>
            <Input
              id="categoryName"
              placeholder="Enter category name"
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
              Description (optional)
            </Label>
            <Input
              id="categoryDesc"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
            />
          </div>

          {/* Image dropzone */}
          <div>
            <div
              className={`min-h-[300px] rounded-[12px] py-9 flex flex-col items-center justify-center border transition-colors gap-3 ${
                isDragOver
                  ? "border-primary/40 bg-primary/5"
                  : "border-[#DCDCDC] bg-[#EFEFEF]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="flex flex-col items-center">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt="Uploaded category"
                    width={200}
                    height={200}
                    className="max-w-full max-h-32 object-contain mb-4"
                  />
                  <button
                    type="button"
                    onClick={handleChangeImage}
                    className="font-figtree font-medium text-[#232323] text-[20px]/[140%] text-center"
                  >
                    Change Picture
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="font-figtree text-[#232323] text-[20px]/[140%] text-center mb-3">
                    Upload Picture
                  </p>
                  <label htmlFor="categoryImageUpload">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="w-fit h-6 p-2 rounded-[24px] bg-[#232323] hover:bg-[#232323]/80 text-white border-0"
                      onClick={handleChangeImage}
                    >
                      Upload Image
                    </Button>
                  </label>
                </>
              )}
              <input
                id="categoryImageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full h-[51px] rounded-[12px] px-5 py-3 font-bold text-[16px]"
              disabled={isSubmitting || !storeTypeId}
              title={!storeTypeId ? "Select a store type first" : undefined}
            >
              {isSubmitting ? "Saving..." : "Save Category"}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full h-[51px] rounded-[12px] px-5 py-3 font-bold text-[16px]"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

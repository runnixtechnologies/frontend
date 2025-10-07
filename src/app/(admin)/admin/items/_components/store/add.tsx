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
import { useState, useMemo } from "react"
import { useCreateStoreTypeMutation } from "@/lib/redux/api/storeType"
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"

interface AddStoreTypeProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStoreType({ open, onOpenChange }: AddStoreTypeProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [createStoreType, { isLoading, isError, error, isSuccess }] =
    useCreateStoreTypeMutation()

  // Preview for selected image
  const preview = useMemo(() => {
    if (!imageFile) return "/images/shopping-basket.png"
    return URL.createObjectURL(imageFile)
  }, [imageFile])

  function resetForm() {
    setName("")
    setDescription("")
    setImageFile(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createStoreType({
        name: name.trim(),
        description: description.trim() || undefined,
        image: imageFile,
      }).unwrap()
      resetForm()
      onOpenChange(false)
    } catch {
      // handled by isError + error
    }
  }

  function handleFileFromInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f && f.type.startsWith("image/")) setImageFile(f)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith("image/")) setImageFile(f)
  }

  const apiError = isError
    ? getApiErrorMessage(error) ?? "Failed to add store type."
    : null

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          resetForm()
        }
        onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#232323] font-bold text-[28px]/[120%]">
            Create New Store Type
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="storeTypeName" className="text-xs text-[#525252]">
              Store Type Name
            </Label>
            <Input
              id="storeTypeName"
              placeholder="Enter store type name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="storeTypeDesc" className="text-xs text-[#525252]">
              Description (optional)
            </Label>
            <Input
              id="storeTypeDesc"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
            />
          </div>

          {/* Image uploader */}
          <div
            className={`min-h-[300px] bg-[#EFEFEF] rounded-[12px] py-9 flex flex-col items-center justify-center border transition-colors gap-3 ${
              isDragOver
                ? "border-primary/40 bg-primary/20"
                : "border-[#DCDCDC]"
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setIsDragOver(false)
            }}
            onDrop={onDrop}
          >
            <div className="flex flex-col items-center">
              <div className="mb-4">
                {imageFile ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="object-contain max-h-40"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <ImageIcon />
                  </div>
                )}
              </div>

              <label htmlFor="imageUpload">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit h-8 px-3 rounded-[24px] bg-[#232323] text-white border-0"
                  asChild
                >
                  <span>{imageFile ? "Change Image" : "Upload Image"}</span>
                </Button>
              </label>

              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleFileFromInput}
                className="hidden"
              />
            </div>
          </div>

          {apiError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {apiError}
            </div>
          )}
          {isSuccess && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              Store type created.
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full h-[51px] rounded-[12px] font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-[51px] rounded-[12px]"
              disabled
            >
              Delete Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

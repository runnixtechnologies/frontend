"use client"

import { EditIcon } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

interface ImageUploadAreaProps {
  title: string
  onOpen: () => void
  onEdit: () => void
  onRemove?: () => void
  image?: string
  isUploading?: boolean
}

function ImageUploadArea({
  title,
  onOpen,
  onEdit,
  onRemove,
  image,
  isUploading,
}: ImageUploadAreaProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-figtree font-medium text-[14px]/[20px] text-[#666666] tracking-normal">
          {title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-auto p-1 text-[14px]/[20px] font-medium text-primary tracking-normal hover:text-primary/70"
        >
          <EditIcon />
          <span className="ml-1 text-sm">Edit</span>
        </Button>
      </div>

      <div className="relative w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          </div>
        ) : image ? (
          <>
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2">
              <Button
                onClick={onRemove}
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
              <Button
                onClick={onEdit}
                variant="secondary"
                className="bg-white/90 hover:bg-white text-[#232323]"
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={onOpen}
              className="bg-gray-800 hover:bg-[#232323] text-white px-6 py-2 rounded-md"
            >
              Open
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VehicleExterior() {
  const [images, setImages] = useState<Record<string, string | undefined>>({
    front: undefined,
    side: undefined,
    back: undefined,
  })
  const [uploadingStates, setUploadingStates] = useState<
    Record<string, boolean>
  >({
    front: false,
    side: false,
    back: false,
  })

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)")
      return false
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB")
      return false
    }

    return true
  }

  const handleFileUpload = async (file: File, view: string) => {
    if (!validateFile(file)) return

    setUploadingStates((prev) => ({ ...prev, [view]: true }))

    try {
      // Create a preview URL for the uploaded file
      const previewUrl = URL.createObjectURL(file)

      // Simulate upload delay (in real app, this would be actual upload to server/cloud)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setImages((prev) => ({
        ...prev,
        [view]: previewUrl,
      }))

      toast.success(
        `${
          view.charAt(0).toUpperCase() + view.slice(1)
        } view image uploaded successfully`
      )
    } catch (error) {
      toast.error("Failed to upload image. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setUploadingStates((prev) => ({ ...prev, [view]: false }))
    }
  }

  const handleFileSelect = (view: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/jpeg,image/jpg,image/png,image/webp"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFileUpload(file, view)
      }
    }
    input.click()
  }

  const handleOpen = (view: string) => {
    handleFileSelect(view)
  }

  const handleEdit = (view: string) => {
    handleFileSelect(view)
  }

  const handleRemove = (view: string) => {
    // Revoke the object URL to free memory
    if (images[view]) {
      URL.revokeObjectURL(images[view]!)
    }

    setImages((prev) => ({
      ...prev,
      [view]: undefined,
    }))

    toast.success(
      `${view.charAt(0).toUpperCase() + view.slice(1)} view image removed`
    )
  }

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <h2 className="text-[18px]/[24px] font-figtree font-semibold text-[#232323] -tracking-[2%]">
        Vehicle Exterior
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px]">
        <ImageUploadArea
          title="Front View"
          onOpen={() => handleOpen("front")}
          onEdit={() => handleEdit("front")}
          onRemove={() => handleRemove("front")}
          image={images.front}
          isUploading={uploadingStates.front}
        />

        <ImageUploadArea
          title="Side View"
          onOpen={() => handleOpen("side")}
          onRemove={() => handleRemove("front")}
          onEdit={() => handleEdit("side")}
          image={images.side}
          isUploading={uploadingStates.side}
        />

        <ImageUploadArea
          title="Back View"
          onOpen={() => handleOpen("back")}
          onEdit={() => handleEdit("back")}
          onRemove={() => handleRemove("back")}
          image={images.back}
          isUploading={uploadingStates.back}
        />
      </div>
    </div>
  )
}

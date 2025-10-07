"use client"

import { EditIcon } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  useUploadVehicleImageMutation,
  useRemoveVehicleImageMutation,
  type VehicleView,
} from "@/lib/redux/api/riders"
import { useGetSingleUserQuery } from "@/lib/redux/api/users"

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

type ImagesState = Record<VehicleView, string | undefined>
type UploadingState = Record<VehicleView, boolean>

export default function VehicleExterior({ userId }: { userId: number }) {
  const { data: singleResp } = useGetSingleUserQuery(
    { userType: "rider", id: userId },
    { skip: !userId }
  )

  const user: any = useMemo(
    () => (singleResp ? (singleResp as any).data ?? singleResp : undefined),
    [singleResp]
  )

  // Pre-fill from API. Replace with the exact keys your backend returns.
  const initialImages = useMemo<ImagesState>(
    () => ({
      front:
        user?.rider?.vehicle_front_image ??
        user?.rider?.id_card_front ??
        undefined,
      side: user?.rider?.vehicle_side_image ?? undefined,
      back:
        user?.rider?.vehicle_back_image ??
        user?.rider?.id_card_back ??
        undefined,
    }),
    [user]
  )

  const [images, setImages] = useState<ImagesState>({
    front: undefined,
    side: undefined,
    back: undefined,
  })
  const [uploading, setUploading] = useState<UploadingState>({
    front: false,
    side: false,
    back: false,
  })

  useEffect(() => {
    setImages(initialImages)
  }, [initialImages])

  const [uploadVehicleImage] = useUploadVehicleImageMutation()
  const [removeVehicleImage] = useRemoveVehicleImageMutation()

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)")
      return false
    }
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB")
      return false
    }
    return true
  }

  const doUpload = async (view: VehicleView, file: File) => {
    if (!validateFile(file)) return
    setUploading((s) => ({ ...s, [view]: true }))
    try {
      const res = await uploadVehicleImage({
        userId,
        view,
        file,
        userType: "rider",
      }).unwrap()
      setImages((s) => ({ ...s, [view]: res.url }))
      toast.success(`${view[0].toUpperCase() + view.slice(1)} image uploaded`)
    } catch {
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setUploading((s) => ({ ...s, [view]: false }))
    }
  }

  const doRemove = async (view: VehicleView) => {
    setUploading((s) => ({ ...s, [view]: true }))
    try {
      await removeVehicleImage({ userId, view, userType: "rider" }).unwrap()
      setImages((s) => ({ ...s, [view]: undefined }))
      toast.success(`${view[0].toUpperCase() + view.slice(1)} image removed`)
    } catch {
      toast.error("Failed to remove image.")
    } finally {
      setUploading((s) => ({ ...s, [view]: false }))
    }
  }

  const pickFile = (cb: (f: File) => void) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/jpeg,image/jpg,image/png,image/webp"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) cb(file)
    }
    input.click()
  }

  const handleOpen = (view: VehicleView) => pickFile((f) => doUpload(view, f))
  const handleEdit = (view: VehicleView) => pickFile((f) => doUpload(view, f))
  const handleRemove = (view: VehicleView) => doRemove(view)

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
          isUploading={uploading.front}
        />
        <ImageUploadArea
          title="Side View"
          onOpen={() => handleOpen("side")}
          onEdit={() => handleEdit("side")}
          onRemove={() => handleRemove("side")}
          image={images.side}
          isUploading={uploading.side}
        />
        <ImageUploadArea
          title="Back View"
          onOpen={() => handleOpen("back")}
          onEdit={() => handleEdit("back")}
          onRemove={() => handleRemove("back")}
          image={images.back}
          isUploading={uploading.back}
        />
      </div>
    </div>
  )
}

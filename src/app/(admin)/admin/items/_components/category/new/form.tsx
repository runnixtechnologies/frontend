"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useRef, useState } from "react"
import { CreateCategoryData } from "../../types"

const clsx =
  "flex-1 pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"

interface CreateCategoryFormProps {
  onSubmit: (category: CreateCategoryData) => void
  onClose: () => void
}

export function CreateCategoryForm({
  onSubmit,
  onClose,
}: CreateCategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    image: "/images/shopping-basket.png",
    icon: "/images/shopping-basket.png",
    categoryType: "subcategory", // "subcategory" or "main"
    mainCategory: "",
  })

  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      return
    }

    onSubmit({
      name: formData.name,
      mainCategory: formData.mainCategory,
      description: "",
      image: formData.image,
      icon: formData.icon,
      isNewMainCategory: formData.categoryType === "main",
    })

    setFormData({
      name: "",
      image: "/images/shopping-basket.png",
      icon: "/images/shopping-basket.png",
      categoryType: "subcategory",
      mainCategory: "",
    })
  }

  const handleFileSelect = (file: File) => {
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes

    if (file.size > maxSize) {
      alert(
        `File size exceeds 2MB limit. Please choose a smaller image. Current size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`
      )
      return
    }

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    } else {
      alert("Please select a valid image file.")
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
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
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Category</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {/* Category Name */}
        <div className="space-y-2">
          <Label htmlFor="categoryName" className="text-[12px]/[140%]">
            Category Name
          </Label>
          <Input
            id="categoryName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
            className={clsx}
            required
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <div
            className={`relative cursor-pointer transition-colors ${
              isDragOver
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleImageClick}
          >
            <div className="w-full h-64 border-2 border-dashed rounded-lg overflow-hidden relative">
              {formData.image ? (
                <Image
                  src={formData.image || "/placeholder.svg"}
                  width={120}
                  height={20}
                  alt="Category preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Max size: 2MB</p>
                </div>
              )}

              {/* Overlay for hover effect */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                <span className="text-white opacity-0 hover:opacity-100 font-semibold text-[16px]/[120%] -tracking-[2%]">
                  Change Image
                </span>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <Button
            type="button"
            variant="link"
            onClick={handleImageClick}
            className="font-semibold text-[16px]/[120%] -tracking-[2%]"
          >
            Change Picture
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button type="submit" className="w-full text-white py-3 opacity-50">
            {formData.categoryType === "main"
              ? "Create Main Category"
              : "Create Category"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full opacity-50"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

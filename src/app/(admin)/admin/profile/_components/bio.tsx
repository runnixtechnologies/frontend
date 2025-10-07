"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import { useState } from "react"

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Ebibere",
    lastName: "Iwalewa",
    email: "ebi@gmail.com",
    phone: "080808080808",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: "Ebibere",
      lastName: "Iwalewa",
      email: "ebi@gmail.com",
      phone: "080808080808",
    })
    setIsEditing(false)
  }
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Personal Information
          </h2>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
            >
              First Name
            </Label>
            {isEditing ? (
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="border-gray-300"
              />
            ) : (
              <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
                {formData.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
            >
              Last Name
            </Label>
            {isEditing ? (
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="border-gray-300"
              />
            ) : (
              <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
                {formData.lastName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
            >
              Email Address
            </Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border-gray-300"
              />
            ) : (
              <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
                {formData.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]"
            >
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="border-gray-300"
              />
            ) : (
              <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
                {formData.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Change Password
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

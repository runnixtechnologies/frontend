"use client"

import type React from "react"

import { ArrowBack, ImageIcon } from "@/components/svgs"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useEffect, useState } from "react"
import { z } from "zod"

// Zod schema for form validation
const businessDetailsSchema = z.object({
  storeName: z
    .string()
    .min(1, "Store name is required")
    .min(2, "Store name must be at least 2 characters"),
  businessAddress: z
    .string()
    .min(1, "Business address is required")
    .min(5, "Please enter a valid address"),
  businessEmail: z
    .string()
    .min(1, "Business email is required")
    .email("Please enter a valid email address"),
  registrationNumber: z
    .string()
    .min(1, "Business registration number is required"),
  logo: z.instanceof(File).optional().nullable(),
})

type BusinessDetailsForm = z.infer<typeof businessDetailsSchema>

interface FormErrors {
  storeName?: string
  businessAddress?: string
  businessEmail?: string
  registrationNumber?: string
  logo?: string
}

export default function BusinessDetailsForm() {
  const [formData, setFormData] = useState({
    storeName: "",
    businessAddress: "",
    businessEmail: "",
    registrationNumber: "",
    logo: null as File | null,
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    // Cleanup function to revoke the object URL when component unmounts
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          logo: "File size must be less than 5MB",
        }))
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          logo: "Please upload a valid image file",
        }))
        return
      }

      setFormData((prev) => ({ ...prev, logo: file }))
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setLogoPreview(previewUrl)

      // Clear logo error if it exists
      if (errors.logo) {
        setErrors((prev) => ({ ...prev, logo: undefined }))
      }
    }
  }

  const validateForm = (): boolean => {
    try {
      businessDetailsSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors
          newErrors[field] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Form submitted:", formData)
      // Handle successful submission here
      alert("Business details submitted successfully!")
    } catch (error) {
      console.error("Submission error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      // setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col">
      <Link
        href="/otp"
        className="px-8 xl:px-20 font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
      >
        <ArrowBack /> Go back
      </Link>
      <div className="w-full flex justify-center items-center">
        <div className="bg-white dark:bg-[#161226] w-full lg:w-[480px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
          <div className="w-full flex flex-col gap-2 mb-[24px]">
            <h2 className="font-figtree text-[#36264F] font-bold text-[40px]/[120%] -tracking-[2%] text-center">
              Business Details
            </h2>
            <p className="font-figtree font-normal text-[16px]/[140%] tracking-normal text-[#525252] text-center">
              Tell us about your business
            </p>
          </div>
          <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-6 justify-center items-center">
            <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    type="text"
                    name="storeName"
                    placeholder="Store Name"
                    value={formData.storeName}
                    onChange={(e) =>
                      handleInputChange("storeName", e.target.value)
                    }
                    className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                  />
                  {errors.storeName && (
                    <p className="font-figtree text-xs xs:text-sm text-destructive mt-1">
                      {errors.storeName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    name="businessAddress"
                    placeholder="Business Address"
                    value={formData.businessAddress}
                    onChange={(e) =>
                      handleInputChange("businessAddress", e.target.value)
                    }
                    className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                  />
                  {errors.businessAddress && (
                    <p className="font-figtree text-xs xs:text-sm text-destructive mt-1">
                      {errors.businessAddress}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="email"
                    name="businessEmail"
                    placeholder="Business Email Address"
                    value={formData.businessEmail}
                    onChange={(e) =>
                      handleInputChange("businessEmail", e.target.value)
                    }
                    className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                  />
                  {errors.businessEmail && (
                    <p className="font-figtree text-xs xs:text-sm text-destructive mt-1">
                      {errors.businessEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    name="registrationNumber"
                    placeholder="Business Registration Number"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      handleInputChange("registrationNumber", e.target.value)
                    }
                    className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                  />
                  {errors.registrationNumber && (
                    <p className="font-figtree text-xs xs:text-sm text-destructive mt-1">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <Avatar
                        className={`w-16 h-16 border-2 ${
                          errors.logo ? "border-destructive" : "border-gray-300"
                        }`}
                      >
                        <AvatarImage
                          src={logoPreview || "/placeholder.svg"}
                          alt="Business logo"
                        />
                      </Avatar>
                    ) : (
                      <ImageIcon />
                    )}
                    <div className="flex-1">
                      <Label className="font-figtree font-normal text-[#232323] text-[16px]/[140%]">
                        Business Logo (Optional)
                      </Label>
                      <div className="mt-2">
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-fit h-6 bg-[#232323] hover:bg-[#232323]/70 text-white font-figtree text-[12px]/[140%] rounded-[24px] p-2 tracking-normal"
                            asChild
                          >
                            <span>
                              {logoPreview ? "Change Image" : "Upload Image"}
                            </span>
                          </Button>
                        </Label>
                        <Input
                          id="logo-upload"
                          name="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                      {errors.logo && (
                        <p className="font-figtree text-xs xs:text-sm text-destructive mt-1">
                          {errors.logo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] py-3 xs:py-4 px-4 xs:px-5 rounded-lg xs:rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-sm xs:text-base leading-[120%] -tracking-[2%] text-white"
                >
                  <span className="flex items-center gap-1 xs:gap-2">
                    Proceed
                  </span>
                </Button>
                <p className="font-figtree font-normal text-[14px]/[140%] tracking-normal text-[#525252] text-center">
                  By signing up, you agree to Runnix&apos;s{" "}
                  <Link
                    href="/landing/terms"
                    className="text-primary font-bold"
                  >
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/landing/privacy-policy"
                    className="text-primary font-bold"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

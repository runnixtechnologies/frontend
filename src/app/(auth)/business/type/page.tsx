"use client"

import { ArrowBack } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the business types
type BusinessType = "food" | "supermarkets" | "it" | "fashion"

interface BusinessTypeOption {
  id: BusinessType
  label: string
  icon: string
}

// Define the form schema with Zod
const formSchema = z.object({
  businessType: z.enum(["food", "supermarkets", "it", "fashion"], {
    required_error: "Please select a business type",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function BusinessTypeSelection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const businessTypes: BusinessTypeOption[] = [
    {
      id: "food",
      label: "Food",
      icon: "/images/shopping-basket.png",
    },
    {
      id: "supermarkets",
      label: "Supermarkets & Stores",
      icon: "/images/items/item-3.png",
    },
    {
      id: "it",
      label: "IT & Gadgets",
      icon: "/images/monitor.png",
    },
    {
      id: "fashion",
      label: "Fashion & Lifestyle",
      icon: "/images/fashion.png",
    },
  ]

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: undefined,
    },
  })

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Selected business type:", data.businessType)
      // Handle successful submission here
      alert(`Business type "${data.businessType}" selected successfully!`)
    } catch (error) {
      console.error("Submission error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col">
      <Link
        href="/business/details"
        className="px-8 xl:px-20 font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
      >
        <ArrowBack /> Go back
      </Link>
      <div className="w-full flex justify-center items-center">
        <div className="bg-white dark:bg-[#161226] w-full lg:w-[480px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
          <div className="w-full flex flex-col gap-2 mb-[24px]">
            <h2 className="font-figtree text-[#36264F] font-bold text-[40px]/[120%] -tracking-[2%] text-center">
              Business Type
            </h2>
            <p className="font-figtree font-normal text-[16px]/[140%] tracking-normal text-[#525252] text-center">
              What category does your business fall under?
            </p>
          </div>
          <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-6 justify-center items-center">
            <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-4"
                          >
                            {businessTypes.map((type) => (
                              <FormItem
                                key={type.id}
                                className="flex items-center space-x-0 space-y-0"
                              >
                                <Label
                                  htmlFor={`type-${type.id}`}
                                  className={`flex items-center justify-between w-full p-4 rounded-lg bg-[#F7F6FC] hover:bg-[#F7F6FC]/90 transition-colors cursor-pointer ${
                                    field.value === type.id
                                      ? "ring-2 ring-primary"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <Image
                                      src={type.icon || "/placeholder.svg"}
                                      alt={type.label}
                                      width={48}
                                      height={48}
                                      className="w-12 h-12 object-contain"
                                    />
                                    <span className="text-base font-medium">
                                      {type.label}
                                    </span>
                                  </div>
                                  <FormControl>
                                    <RadioGroupItem
                                      value={type.id}
                                      id={`type-${type.id}`}
                                      className="text-primary"
                                    />
                                  </FormControl>
                                </Label>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-center" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] py-3 xs:py-4 px-4 xs:px-5 rounded-lg xs:rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-sm xs:text-base leading-[120%] -tracking-[2%] text-white"
                  >
                    {isSubmitting ? "Processing..." : "Proceed"}
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
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import {
  CompassIcon,
  LocationCheckedIcon,
  PackageAltIcon,
  PackageCheckedIcon,
  ScaleIcon,
} from "@/components/svgs"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z.object({
  pickup: z.string().min(2, {
    message: "Pickup address is required.",
  }),
  destination: z.string().min(2, {
    message: "Destination address is required.",
  }),
  packageName: z.string().min(2, {
    message: "Package name is required.",
  }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

interface PackageInformationProps {
  nextStep: () => void
}

export default function PackageInformation({
  nextStep = () => {},
}: PackageInformationProps) {
  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickup: "",
      destination: "",
      packageName: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    console.log("Form data:", data)
    nextStep()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#36264F] mb-6">
        Send a Package Anywhere
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Pickup Address */}
          <FormField
            control={form.control}
            name="pickup"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm/[140%] font-normal text-[#525252]">
                  Pickup Location:
                </FormLabel>
                <div className="relative">
                  <PackageCheckedIcon className="absolute left-3 top-3 h-5 w-5" />
                  <FormControl>
                    <Input
                      placeholder="Enter Pickup Address"
                      className="pl-10 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-b hover:border-0 placeholder:text-[#BDBDBD]"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-2 rounded-full p-1"
                  >
                    <CompassIcon />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Destination Address */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm/[140%] font-normal text-[#525252]">
                  Destination Address:
                </FormLabel>
                <div className="relative">
                  <LocationCheckedIcon className="absolute left-3 top-3 h-5 w-5" />
                  <FormControl>
                    <Input
                      placeholder="Enter Destination Address"
                      className="pl-10 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-b placeholder:text-[#BDBDBD]"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-2 rounded-full p-1"
                  >
                    <CompassIcon />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Package Name */}
          <div>
            <h3 className="font-bold text-[18px]/[120%] text-[#232323] mb-2 tracking-normal">
              What are you Transporting?
            </h3>
            <FormField
              control={form.control}
              name="packageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm/[140%] font-normal text-[#525252]">
                    Package Name:
                  </FormLabel>
                  <div className="relative">
                    <PackageAltIcon className="absolute left-3 top-3 h-5 w-5" />
                    <FormControl>
                      <Input
                        placeholder="Enter Package name"
                        className="pl-10 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-b placeholder:text-[#BDBDBD]"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Package Size Warning */}
          <div className="bg-[#FFF1F1] rounded-[8px] p-4 flex items-start gap-3">
            <ScaleIcon />
            <div className="text-base/[140%] font-normal tracking-normal text-[#232323]">
              The package size and weight must not exceed{" "}
              <span className="font-bold">65 x 55 x 40 cm³</span> and{" "}
              <span className="font-bold">20kg</span> respectively.
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-[46px] py-3 px-5 rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base leading-[120%] -tracking-[2%] text-white"
          >
            Next
          </Button>
        </form>
      </Form>
    </div>
  )
}

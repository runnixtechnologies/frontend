"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTitle } from "@radix-ui/react-dialog"
import { ArrowRight, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z.object({
  number: z.string().min(2, {
    message: "Tracking number is required",
  }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

const inputStyle = `w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] font-normal font-figtree text-sm xs:text-base leading-[120%] -tracking-[2%] border border-solid outline-none focus:outline-none focus:border-0 ring-0 focus:ring-0 focus:shadow-none border-[#E5E7EB] hover:border-[#7F5BAE] focus:border-[#7F5BAE] rounded-lg xs:rounded-xl p-3 xs:p-4 bg-[#EFEFEF] text-[#232323] placeholder:capitalize placeholder:text-[#989898]`

export default function TrackAnotherPackage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    console.log("data", data)
    if (data) {
      router.push(`/landing/track-order?id=${data?.number}`)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-[51px] py-4 px-5 border border-primary rounded-[12px] text-primary font-bold text-[16px]/[120%] -tracking-[-2%] font-figtree"
        >
          Track another package
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#161226] w-[calc(100%-24px)] max-w-[90vw] xs:max-w-[85vw] md:max-w-[640px] h-auto max-h-[90vh] xs:max-h-[85vh] sm:max-h-[650px] overflow-y-auto grid grid-cols-1 py-[24px] xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-[24px] gap-[16px] xs:gap-[20px] sm:gap-[24px] rounded-[20px] xs:rounded-[28px] sm:rounded-[37px] border-l-[1px] border-t-[1px] border-b-[2px] xs:border-b-[3px] sm:border-b-[4px] border-r-[2px] xs:border-r-[3px] sm:border-r-[4px] shadow-[0px_12px_30px_0px_#0000001A] xs:shadow-[0px_16px_40px_0px_#0000001A] sm:shadow-[0px_22px_49px_0px_#0000001A]">
        <DialogTitle />
        <DialogClose className="absolute right-2 xs:right-4 top-2 xs:top-6 md:top-4 bg-white flex justify-center items-center cursor-pointer z-10">
          <X className="text-[#202426] w-6 h-6 xs:w-[30px] xs:h-[30px] md:w-[36px] md:h-[36px]" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-[24px] justify-center items-center">
          <div className="relative w-[120px] h-[120px] xs:w-[150px] md:w-[200px] md:h-[200px]">
            <Image
              src="/package-delivery.svg"
              alt="package delivery illustration"
              fill
              className="object-contain"
            />
          </div>
          <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
            <div className="w-full flex flex-col justify-center items-center gap-1 xs:gap-2">
              <h4 className="font-figtree font-bold text-[24px] sm:text-[28px] md:text-[40px]/[120%] tracking-[2%] text-center text-[#232323]">
                Track your Order
              </h4>
              <p className="font-figtree font-normal text-[#636066] text-sm md:text-base leading-[140%] -tracking-[2%] text-center">
                Paste your package tracking number below to get the real time
                progress of your package delivery.
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 xs:space-y-5 sm:space-y-6 p-0 xs:p-1 sm:p-2">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter tracking number here"
                            className={inputStyle}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-figtree text-xs xs:text-sm" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="mt-4 xs:mt-5 sm:mt-6 p-0 xs:p-1 sm:p-2">
                  <Button
                    type="submit"
                    className="w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] py-3 xs:py-4 px-4 xs:px-5 rounded-lg xs:rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-sm xs:text-base leading-[120%] -tracking-[2%] text-white"
                  >
                    <span className="flex items-center gap-1 xs:gap-2">
                      Track Order Now{" "}
                      <ArrowRight className="w-4 h-4 xs:w-5 xs:h-5 ml-1" />
                    </span>
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

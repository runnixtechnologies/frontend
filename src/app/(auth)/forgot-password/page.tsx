"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export default function ForgotPasswordPage() {
  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    console.log("data", data)
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white dark:bg-[#161226] w-full lg:w-[480px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
        <div className="w-full flex flex-col gap-2 mb-[24px]">
          <span className="font-figtree text-[#232323] font-normal text-[40px]/[120%] -tracking-[2%] text-center">
            Forgot Password
          </span>
          <span className="font-figtree font-normal text-[16px]/[140%] tracking-normal text-[#525252] text-center">
            Forgot password? Don&apos;t worry, we will help you reset it
          </span>
        </div>

        <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 xs:space-y-5 sm:space-y-6 p-0 xs:p-1 sm:p-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter Email Address"
                          className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
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
                    Log in
                  </span>
                </Button>
              </CardFooter>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

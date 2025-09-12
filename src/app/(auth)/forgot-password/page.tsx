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
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"
import { useForgotPasswordMutation } from "@/lib/redux/api/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

type FormValues = z.infer<typeof formSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [forgotPassword, { isLoading, isError, error }] =
    useForgotPasswordMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: FormValues) {
    try {
      const res = await forgotPassword({ email: values.email }).unwrap()
      router.push(
        `/otp?e=${encodeURIComponent(values.email)}&t=${encodeURIComponent(
          res?.data?.token ?? ""
        )}`
      )
    } catch {}
  }

  const apiError =
    getApiErrorMessage(error) ?? (isError ? "Login failed." : null)

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white w-full lg:w-[480px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
        <div className="w-full flex flex-col gap-2 mb-[24px]">
          <span className="font-figtree text-[#232323] font-normal text-[40px]/[120%] -tracking-[2%] text-center">
            Forgot Password
          </span>
          <span className="font-figtree font-normal text-[16px]/[140%] tracking-normal text-[#525252] text-center">
            Forgot password? Don&apos;t worry, we’ll help you reset it.
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-4 p-0">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        autoComplete="email"
                        className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-figtree text-xs" />
                  </FormItem>
                )}
              />

              {isError && (
                <p className="text-red-500 text-sm font-figtree">{apiError}</p>
              )}
            </CardContent>

            <CardFooter className="mt-4 p-0">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] rounded-lg bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base text-white"
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </div>
    </div>
  )
}

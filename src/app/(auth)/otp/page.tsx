"use client"

import { ArrowBack } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP must be 6 digits.",
  }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const search = useSearchParams()
  const email = search.get("email")
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })

  async function onSubmit(data: FormValues) {
    console.log("Submitted OTP:", data.otp)
  }

  return (
    <div className="w-full flex flex-col min-h-[80vh]">
      <Link
        href="/signup"
        className="px-8 xl:px-20 font-figtree font-medium text-sm/[20px] hover:underline tracking-normal text-[#666666] flex items-center gap-1"
      >
        <ArrowBack /> Go back
      </Link>
      <div className="w-full flex justify-center items-center">
        <div className="bg-white dark:bg-[#161226] w-full lg:w-[464px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
          <div className="w-full flex flex-col gap-2 mb-[24px]">
            <span className="font-figtree text-[#232323] font-bold text-[40px]/[120%] -tracking-[2%] text-center">
              Verify Email Address
            </span>
            <span className="font-figtree font-bold text-[16px]/[140%] tracking-normal text-[#525252] text-center">
              A 6-digit code was sent to{" "}
              <span className="font-bold">{email}</span>{" "}
              <Link
                href="/landing/send-package/auth/signup"
                className="text-primary"
              >
                Change Email Address
              </Link>
              <Link
                href="/landing/send-package/auth/signup"
                className="text-primary"
              >
                Sign up as a user
              </Link>
            </span>
          </div>

          <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-6 justify-center items-center">
            <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4 xs:space-y-5 sm:space-y-6 p-0 xs:p-1 sm:p-2">
                    <Controller
                      name="otp"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col items-center gap-2 w-full">
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <InputOTPGroup className="flex gap-2">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                          {fieldState.error && (
                            <p className="text-sm text-red-500">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4 mt-4 xs:mt-5 sm:mt-6 p-0 xs:p-1 sm:p-2">
                    <Button
                      type="submit"
                      className="w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] py-3 xs:py-4 px-4 xs:px-5 rounded-lg xs:rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-sm xs:text-base leading-[120%] -tracking-[2%] text-white"
                    >
                      <span className="flex items-center gap-1 xs:gap-2">
                        Verify Account
                      </span>
                    </Button>
                    <p className="font-figtree font-normal text-[14px]/[140%] tracking-normal text-[#525252] text-center">
                      Didn&apos;t receive code?{" "}
                      <Link
                        href="/landing/send-package/auth/signup"
                        className="text-primary font-bold"
                      >
                        Resend OTP
                      </Link>{" "}
                    </p>
                  </CardFooter>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/lib/redux/api/auth"
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"

// numeric 6-digit OTP only
const formSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits."),
})

type FormValues = z.infer<typeof formSchema>

export default function OTPPage() {
  const search = useSearchParams()
  const router = useRouter()
  const email = search.get("e") ?? ""
  const token = search.get("t") ?? ""

  const [
    verifyOtp,
    { isLoading: isVerifying, error: verifyError, isError: verifyIsError },
  ] = useVerifyOtpMutation()

  const [
    resendOtp,
    { isLoading: isResending, error: resendError, isError: resendIsError },
  ] = useResendOtpMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
    mode: "onChange",
  })

  // keep OTP numeric
  const otpValue = form.watch("otp")
  useEffect(() => {
    const onlyDigits = otpValue.replace(/\D+/g, "").slice(0, 6)
    if (onlyDigits !== otpValue) {
      form.setValue("otp", onlyDigits, { shouldValidate: true })
    }
  }, [otpValue, form])

  // resend cooldown (30s)
  const COOLDOWN = 30
  const [cooldown, setCooldown] = useState<number>(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const canSubmit = useMemo(
    () =>
      form.formState.isValid &&
      !isVerifying &&
      form.getValues("otp").length === 6,
    [isVerifying, form]
  )

  const submitVerify = useCallback(
    async (otp: string) => {
      try {
        const res = await verifyOtp({ code: otp, token }).unwrap()
        router.push(`/reset-password/${res?.data?.token}`)
      } catch {}
    },
    [verifyOtp, token, router]
  )

  async function onSubmit(values: FormValues) {
    await submitVerify(values.otp)
  }

  async function handleResendOTP() {
    try {
      await resendOtp({ token }).unwrap()
      setCooldown(COOLDOWN)
    } catch (err) {
      console.log(err)
    }
  }

  const verifyErrText = verifyIsError ? getApiErrorMessage(verifyError) : null
  const resendErrText = resendIsError ? getApiErrorMessage(resendError) : null
  const missingIdentity = !email && !token
  console.log("missingIdentity", missingIdentity)
  return (
    <div className="w-full flex flex-col min-h-[80vh]">
      <div className="w-full flex justify-center items-center">
        <div className="bg-white dark:bg-[#161226] w-full lg:w-[464px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
          <div className="w-full flex flex-col gap-2 mb-[24px]">
            <span className="font-figtree text-[#232323] font-bold text-[40px]/[120%] -tracking-[2%] text-center">
              Verify Email Address
            </span>
            <span className="font-figtree font-bold text-[16px]/[140%] tracking-normal text-[#525252] text-center">
              A 6-digit code was sent to{" "}
              <span className="font-bold text-primary">
                {email || "your email"}
              </span>
            </span>
            {missingIdentity && (
              <span className="text-amber-600 text-center text-sm">
                Missing email/token in URL. Open the verification link again.
              </span>
            )}
          </div>

          <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-6 justify-center items-center">
            <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
                            // If your InputOTP supports onComplete, you can single-fire submit:
                            // onComplete={(code) => submitVerify(code)}
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

                          {(fieldState.error || verifyErrText) && (
                            <p className="text-sm text-red-500">
                              {fieldState.error?.message ?? verifyErrText}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    {resendErrText && (
                      <p className="text-sm text-red-500 text-center">
                        {resendErrText}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4 mt-4 xs:mt-5 sm:mt-6 p-0 xs:p-1 sm:p-2">
                    <Button
                      type="submit"
                      disabled={!canSubmit || missingIdentity}
                      className="w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] py-3 xs:py-4 px-4 xs:px-5 rounded-lg xs:rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-sm xs:text-base leading-[120%] -tracking-[2%] text-white"
                    >
                      <span className="flex items-center gap-1 xs:gap-2">
                        {isVerifying ? "Verifying..." : "Verify Account"}
                      </span>
                    </Button>

                    <p className="font-figtree font-normal text-[14px]/[140%] tracking-normal text-[#525252] text-center">
                      Didn&apos;t receive code?{" "}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendOTP}
                        disabled={
                          isResending || cooldown > 0 || missingIdentity
                        }
                        className="text-primary font-bold"
                        title={
                          missingIdentity
                            ? "Missing email/token for resend"
                            : undefined
                        }
                      >
                        {cooldown > 0
                          ? `Resend in ${cooldown}s`
                          : isResending
                          ? "Resending..."
                          : "Resend OTP"}
                      </Button>
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

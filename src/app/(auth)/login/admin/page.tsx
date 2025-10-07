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
import { useLoginMutation } from "@/lib/redux/api/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/lib/redux/auth/slice"
import type { LoginResponse } from "@/lib/redux/api/auth"

// Zod schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters." }),
})
type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [login, { isLoading, isError, error, data }] = useLoginMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: FormValues) {
    try {
      const res = (await login(values).unwrap()) as LoginResponse
      if (res.status !== "00") throw new Error(res.message || "Login failed")

      const { token, role } = res.data
      dispatch(setCredentials(res.data))
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, role: role?.code }),
      })

      localStorage.setItem("auth:token", token)
      localStorage.setItem("auth:user", JSON.stringify(res.data))
      router.push("/admin/dashboard")
    } catch (e) {
      console.log("Login failed:", e)
    }
  }

  const apiError =
    getApiErrorMessage(error) ?? (isError ? "Login failed." : null)

  return (
    <div className="w-full bg-white flex justify-center items-center">
      <div className="bg-white dark:bg-white w-full md:w-[480px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
        <div className="w-full flex flex-col gap-2 mb-[24px]">
          <span className="font-figtree text-[#36264F] font-semibold text-[32px]/[100%] xl:text-[40px]/[100%] -tracking-[2%] text-center">
            Log in to Account
          </span>
          <span className="font-figtree font-bold text-[14px]/[140%] xl:text-[16px]/[140%] tracking-normal text-[#525252] text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </span>
        </div>

        <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-6 justify-center items-center">
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
                            placeholder="Enter Email"
                            className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-figtree text-xs xs:text-sm" />
                      </FormItem>
                    )}
                  />

                  <div className="w-full flex flex-col gap-1">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter Password"
                                className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full flex justify-end items-end mt-2">
                      <Link
                        href="/forgot-password"
                        className="font-figtree font-medium text-[#232323] hover:text-primary text-[16px]/[[120%]] -tracking-[2%] hover:underline hover:underline-offset-4"
                      >
                        Forgot password
                      </Link>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="mt-4 xs:mt-5 sm:mt-6 p-0 xs:p-1 sm:p-2">
                  <div className="w-full flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] py-3 xs:py-4 px-4 xs:px-5 rounded-lg xs:rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-sm xs:text-base leading-[120%] -tracking-[2%] text-white"
                    >
                      <span className="flex items-center gap-1 xs:gap-2">
                        {isLoading ? "logging in..." : "Submit"}
                      </span>
                    </Button>

                    {apiError && (
                      <p className="text-red-500 text-sm font-figtree">
                        {apiError}
                      </p>
                    )}
                    {data?.status === "00" && (
                      <p className="text-green-600 text-sm font-figtree">
                        {data.message || "Logged in successfully."}
                      </p>
                    )}
                  </div>
                </CardFooter>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

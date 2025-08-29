"use client"

import { GoogleIcon } from "@/components/svgs"
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
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export default function UserSignupPage() {
  const router = useRouter()

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    console.log("data", data)
    if (data) {
      router.push(`/landing/send-package/auth/otp?email=aishaidir94@gmail.com`)
    }
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white dark:bg-[#161226] w-full lg:w-[480px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
        <div className="w-full flex flex-col gap-2 mb-[24px]">
          <h2 className="font-figtree text-[#232323] font-bold text-[40px]/[120%] -tracking-[2%] text-center">
            Create Account
          </h2>
          <p className="font-figtree font-bold text-[16px]/[140%] tracking-normal text-[#525252] text-center">
            Already have an account?{" "}
            <Link
              href="/landing/send-package/auth/login"
              className="text-primary"
            >
              Login
            </Link>
          </p>
        </div>
        <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-6 justify-center items-center">
          <Button className="w-full h-[52px] hover:text-white flex gap-3 py-4 px-3 border border-[#E5E0F4] bg-[#F7F6FC] rounded-xl font-figtree font-semibold text-[##232323] text-[[16px]/[120%] tracking-normal text-center align-middle cursor-pointer">
            <GoogleIcon /> Sign up with Google
          </Button>
          <div className="flex items-center w-full gap-4">
            <div className="flex-1 h-px bg-[#E4E3E5]" />
            <span className="text-[#232323] font-figtree text-sm xs:text-base font-medium tracking-wide">
              OR
            </span>
            <div className="flex-1 h-px bg-[#E4E3E5]" />
          </div>
          <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 xs:space-y-5 sm:space-y-6 p-0 xs:p-1 sm:p-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-figtree text-xs xs:text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Last Name"
                            className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-figtree text-xs xs:text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email Address"
                            className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-figtree text-xs xs:text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm Password"
                            className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#7C7C7C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="Referral Code"
                              className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-6 mt-4 xs:mt-5 sm:mt-6 p-0 xs:p-1 sm:p-2">
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
                </CardFooter>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

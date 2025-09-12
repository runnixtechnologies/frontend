"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"
import { useResetPasswordMutation } from "@/lib/redux/api/auth"

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email("Please enter a valid email address."),
    role: z.enum(["super-admin", "admin", "customer-support"]),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters." }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })

type FormValues = z.infer<typeof formSchema>

export default function CreateAccountForm({
  token,
  invite,
  onSuccess,
}: {
  token: string
  invite: {
    firstname: string
    lastname: string
    email: string
    roleCode: "super-admin" | "admin" | "customer-support"
  }
  onSuccess: () => void
}) {
  const [resetPassword, { isLoading, isError, error, data }] =
    useResetPasswordMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: invite.firstname,
      lastName: invite.lastname,
      email: invite.email,
      role: invite.roleCode,
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await resetPassword({
        token,
        password: values.password,
        passwordConfirmation: values.confirmPassword,
      }).unwrap()

      onSuccess()
    } catch {}
  }

  const apiError =
    getApiErrorMessage(error) ?? (isError ? "Failed to set password." : null)

  return (
    <div className="w-full bg-white flex justify-center items-center">
      <div className="bg-white w-full md:w-[480px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
        <h1 className="font-figtree text-[#36264F] font-semibold text-[32px]/[100%] xl:text-[40px]/[100%] -tracking-[2%] text-left">
          Create Account
        </h1>

        <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-6 justify-center items-center">
          <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <CardContent className="space-y-6 p-0">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter First Name"
                              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Last Name"
                              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-figtree text-xs xs:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
                            className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-figtree" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled
                        >
                          <FormControl>
                            <SelectTrigger className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]">
                              <SelectValue
                                placeholder="Role"
                                className="text-[#989898] capitalize"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="font-figtree">
                            <SelectItem value="super-admin">
                              Super-Admin
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="customer-support">
                              Customer support
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-figtree" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Create Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create Password"
                            className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm Password"
                            className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="mt-6 p-0">
                  <div className="w-full flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-[50px] rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base text-white"
                    >
                      {isLoading ? "Setting password..." : "Submit"}
                    </Button>

                    {apiError && (
                      <p className="text-red-500 text-sm font-figtree">
                        {apiError}
                      </p>
                    )}
                    {(data as any)?.success && (
                      <p className="text-green-600 text-sm font-figtree">
                        {(data as any)?.message || "Password set successfully."}
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

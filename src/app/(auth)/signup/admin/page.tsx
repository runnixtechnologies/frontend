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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"
import { useCreatePasswordMutation } from "@/lib/redux/api/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirm password must be at least 6 characters.",
  }),
  role: z.enum(["super-admin", "admin", "customer-support"], {
    required_error: "Please select a role.",
  }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const [createPassword, { isLoading, isError, error, data }] =
    useCreatePasswordMutation()

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      role: undefined as unknown as FormValues["role"],
    },
  })

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      await createPassword({
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        password: values.password,
        password_confirmation: values.confirmPassword,
      }).unwrap()
    } catch (e) {
      console.error("Create password failed:", e)
    }
  }
  const apiError =
    getApiErrorMessage(error) ?? (isError ? "Login failed." : null)
  return (
    <div className="w-full bg-white flex justify-center items-center">
      <div className="bg-white dark:bg-white w-full md:w-[480px] overflow-y-auto grid grid-cols-1 py-6 xs:py-[32px] sm:py-[40px] md:py-[48px] px-[16px] xs:px-4 md:px-6 gap-[16px] xs:gap-[20px] sm:gap-6">
        <h1 className="font-figtree text-[#36264F] font-semibold text-[32px]/[100%] xl:text-[40px]/[100%] -tracking-[2%] text-left">
          Create Account
        </h1>

        <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-6 justify-center items-center">
          <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                {" "}
                <CardContent className="space-y-4 xs:space-y-5 sm:space-y-6 p-0 xs:p-1 sm:p-2">
                  <div className="w-full grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <Label>First Name</Label>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter First Name"
                              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323]
                            hover:border-b placeholder:text-[#7C7C7C]"
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
                          <Label>Last Name</Label>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Last Name"
                              className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323]
                            hover:border-b placeholder:text-[#7C7C7C]"
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]">
                              <SelectValue
                                placeholder="select your role"
                                className="text-[#989898] capitalize"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="font-figtree">
                            <SelectItem value="super-admin">
                              Super-Admin
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="suppoer">
                              Customer support
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-figtree" />
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4 xs:space-y-5 sm:space-y-6 p-0 xs:p-1 sm:p-2">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Create Account</FormLabel>

                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Create Password"
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
                                <FormLabel>Confirm Password</FormLabel>

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
                        </CardContent>
                      </form>
                    </Form>
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

                    {isError && (
                      <p className="text-red-500 text-sm font-figtree">
                        {apiError}
                      </p>
                    )}
                    {data?.success && (
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

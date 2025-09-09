"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"
import { useInviteAdminMutation } from "@/lib/redux/api/admin"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  role: z.enum(["super-admin", "admin", "customer-support"], {
    required_error: "Please select a role.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function InviteAdmin() {
  const [inviteAdmin, { isLoading, isError, error, data }] =
    useInviteAdminMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: undefined as unknown as FormValues["role"],
    },
    mode: "onTouched",
  })

  async function onSubmit(values: FormValues) {
    try {
      await inviteAdmin({
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        email: values.email,
      }).unwrap()
      form.reset()
    } catch (e) {
      console.error("Invite failed:", e)
    }
  }

  const apiError = getApiErrorMessage(error)

  return (
    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Invite new members</Button>
        </DialogTrigger>

        <DialogContent className="w-full bg-white rounded-[24px] py-8 px-9 lg-md:-w-[640px] border-0 shadow-[0px_4px_34.3px_0px_#00000026]">
          <DialogTitle className="text-[#0A0116] font-figtree font-bold text-[28px]/[36px] tracking-normal">
            Invite New Admin Member
          </DialogTitle>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="grid grid-cols-1 gap-[36px]"
            >
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-figtree font-normal text-[10px]/[140%] text-[#525252] tracking-normal">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter First Name"
                          autoComplete="given-name"
                          className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C]"
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
                      <FormLabel className="font-figtree font-normal text-[10px]/[140%] text-[#525252] tracking-normal">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Last Name"
                          autoComplete="family-name"
                          className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C]"
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
                    <FormLabel className="font-figtree font-normal text-[10px]/[140%] text-[#525252] tracking-normal">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter Email Address"
                        autoComplete="email"
                        className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C]"
                        {...field} // ✅ starts as ""
                      />
                    </FormControl>
                    <FormMessage className="font-figtree text-xs xs:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-figtree font-normal text-[10px]/[140%] text-[#525252] tracking-normal">
                      Select Role
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#7C7C7C]">
                          <SelectValue
                            placeholder="select your role"
                            className="text-[#989898] capitalize"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="font-figtree">
                        <SelectItem value="super-admin">Super-Admin</SelectItem>
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[40px] xs:h-[45px] sm:h-[50px] md:h-[54px] py-3 xs:py-4 px-4 xs:px-5 rounded-lg xs:rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-sm xs:text-base leading-[120%] -tracking-[2%] text-white"
              >
                {isLoading ? "Sending invite..." : "Send Invite"}
              </Button>

              {isError && (
                <p className="text-red-500 text-sm font-figtree">{apiError}</p>
              )}
              {data?.success && (
                <p className="text-green-600 text-sm font-figtree">
                  {data.message || "Invite sent successfully."}
                </p>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

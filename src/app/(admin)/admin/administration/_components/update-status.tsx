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
import { useUpdateAdminStatusMutation } from "@/lib/redux/api/admin"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  status: z.string().min(2, "First name must be at least 2 characters."),
  remark: z.string().min(2, "Last name must be at least 2 characters."),
})

type FormValues = z.infer<typeof formSchema>

export function UpdateAdminRole({ adminId }: { adminId: string }) {
  const [updateAdminStatus, { isLoading, isError, error, data }] =
    useUpdateAdminStatusMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      remark: "",
    },
    mode: "onTouched",
  })

  async function onSubmit(values: FormValues) {
    try {
      await updateAdminStatus({
        status: values.status,
        remark: values.remark,
        adminId,
      }).unwrap()
      form.reset()
    } catch (e) {
      console.error("update failed:", e)
    }
  }

  const apiError = getApiErrorMessage(error)

  return (
    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Update Status</Button>
        </DialogTrigger>

        <DialogContent className="w-full bg-white rounded-[24px] py-8 px-9 lg-md:-w-[640px] border-0 shadow-[0px_4px_34.3px_0px_#00000026]">
          <DialogTitle className="text-[#0A0116] font-figtree font-bold text-[28px]/[36px] tracking-normal">
            Update Admin Status
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-figtree font-normal text-[10px]/[140%] text-[#525252] tracking-normal">
                        Select Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#7C7C7C]">
                            <SelectValue
                              placeholder="select status"
                              className="text-[#989898] capitalize"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="font-figtree">
                          <SelectItem value="suspend">Suspend</SelectItem>
                          <SelectItem value="recall">recall</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-figtree" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remark"
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
              {data?.status === "00" && (
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

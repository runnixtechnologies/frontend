"use client"

import { useMemo, useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"
import { useInviteAdminMutation } from "@/lib/redux/api/admin"
import { useGetRolesQuery } from "@/lib/redux/api/utils"

type Permission = { id: number; name: string; code: string }
type Role = { id: number; name: string; code: string }
type GetRolesResponse = {
  status: string
  message: string
  data: { roles: Role[]; permissions: Permission[] }
  errors: unknown[]
}

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  roleId: z.string().min(1, "Please select a role."),
  permissionIds: z.array(z.number()).optional().default([]),
})
type FormValues = z.infer<typeof formSchema>

export function InviteAdmin() {
  const [open, setOpen] = useState(false)

  const {
    data: rolesResp,
    isLoading: rolesLoading,
    isError: rolesIsError,
    error: rolesError,
  } = useGetRolesQuery(undefined, {
    skip: !open,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  })

  // Memoize these so downstream hooks see stable references
  const roles = useMemo(
    () => (rolesResp as GetRolesResponse | undefined)?.data?.roles ?? [],
    [rolesResp]
  )
  const allPermissions = useMemo(
    () => (rolesResp as GetRolesResponse | undefined)?.data?.permissions ?? [],
    [rolesResp]
  )

  const [inviteAdmin, { isLoading, isError, error, data }] =
    useInviteAdminMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
      permissionIds: [],
    },
    mode: "onTouched",
  })

  const selectedRoleId = useWatch({ control: form.control, name: "roleId" })
  const selectedPermissionIds =
    useWatch({ control: form.control, name: "permissionIds" }) ?? []

  // Depends on stable `roles` + `selectedRoleId`
  const selectedRole = useMemo(
    () => roles.find((r) => String(r.id) === String(selectedRoleId)),
    [roles, selectedRoleId]
  )
  const showPermissions =
    selectedRole?.code === "admin" || selectedRole?.code === "customer-support"

  const togglePermission = (id: number, checked: boolean) => {
    const next = new Set(selectedPermissionIds)
    if (checked) next.add(id)
    else next.delete(id)
    form.setValue("permissionIds", Array.from(next), { shouldDirty: true })
  }

  async function onSubmit(values: FormValues) {
    const roleCode = selectedRole?.code
    // super-admin → send ALL permission IDs, hide UI
    const permission_ids =
      roleCode === "super-admin"
        ? allPermissions.map((p) => p.id)
        : showPermissions
        ? values.permissionIds ?? []
        : []

    try {
      await inviteAdmin({
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        role_id: Number(values.roleId),
        permission_ids,
      }).unwrap()
      form.reset()
      setOpen(false)
    } catch {
      /* UI shows error */
    }
  }

  const apiError =
    getApiErrorMessage(error) ?? (isError ? "Invite failed." : null)
  const rolesApiError =
    getApiErrorMessage(rolesError) ??
    (rolesIsError ? "Failed to load roles." : null)

  return (
    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Invite new members</Button>
        </DialogTrigger>

        <DialogContent className="w-full bg-white rounded-[24px] py-8 px-9 border-0 shadow-[0px_4px_34.3px_0px_#00000026]">
          <DialogTitle className="text-[#0A0116] font-figtree font-bold text-[28px]/[36px]">
            Invite New Admin Member
          </DialogTitle>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="grid grid-cols-1 gap-7"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-figtree text-[10px] text-[#525252]">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter First Name"
                          autoComplete="given-name"
                          className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-figtree text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-figtree text-[10px] text-[#525252]">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Last Name"
                          autoComplete="family-name"
                          className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-figtree text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-figtree text-[10px] text-[#525252]">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter Email Address"
                        autoComplete="email"
                        className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-figtree text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-figtree text-[10px] text-[#525252]">
                      Select Role
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!open || rolesLoading || rolesIsError}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2">
                          <SelectValue
                            placeholder={
                              rolesLoading
                                ? "Loading roles..."
                                : "Select a role"
                            }
                            className="text-[#989898]"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="font-figtree">
                        {roles.length > 0 ? (
                          roles.map((r) => (
                            <SelectItem key={r.id} value={String(r.id)}>
                              {r.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            {rolesLoading ? "Loading..." : "No roles available"}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="font-figtree text-xs" />
                    {rolesApiError && (
                      <p className="text-red-500 text-xs mt-2">
                        {rolesApiError}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Only show for admin/customer-support; super-admin hidden */}
              {showPermissions && allPermissions.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                  <h3 className="text-[16px] font-semibold text-[#0A0116]">
                    Extra Permissions (optional)
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {allPermissions.map((p) => {
                      const checked = selectedPermissionIds.includes(p.id)
                      return (
                        <label
                          key={p.id}
                          className="flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span className="font-figtree text-[14px] text-[#232323]">
                            {p.name}
                          </span>
                          <Controller
                            control={form.control}
                            name="permissionIds"
                            render={() => (
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(c) =>
                                  togglePermission(p.id, Boolean(c))
                                }
                                className="h-[18px] w-[18px] rounded-[4px] border border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            )}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[44px] rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-white"
              >
                {isLoading ? "Sending invite..." : "Send Invite"}
              </Button>

              {apiError && (
                <p className="text-red-500 text-sm font-figtree">{apiError}</p>
              )}
              {(data as any)?.status === "00" && (
                <p className="text-green-600 text-sm font-figtree">
                  {(data as any)?.message || "Invite sent successfully."}
                </p>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

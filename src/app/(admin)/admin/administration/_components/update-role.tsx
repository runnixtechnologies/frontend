"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"
import { useUpdateAdminRoleMutation } from "@/lib/redux/api/admin"
import { useGetRolesQuery } from "@/lib/redux/api/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  role: z.string().min(1, "Please select a role."), // keep as string in form
})
type FormValues = z.infer<typeof formSchema>

// ---- Types shaped from your payload ----
type Permission = {
  id: number
  name: string
  code: string
  status: number
  created_at: string
  updated_at: string
}

type RolePermissionPivot = {
  id: number
  role_id: number
  permission_id: number
  status: number
  created_at: string
  updated_at: string
  permission: Permission
}

type Role = {
  id: number
  name: string
  code: string
  status: number
  created_at: string
  updated_at: string
  permissions: RolePermissionPivot[]
}

type GetRolesResponse = {
  status: string
  message: string
  data: {
    roles: Role[]
    permissions: Permission[]
  }
  errors: unknown[]
}

export function UpdateRoles({ adminId }: { adminId: number }) {
  const [updateAdminRole, { isLoading, isError, error, data }] =
    useUpdateAdminRoleMutation()

  // Fetch roles + master permissions
  const {
    data: rolesResp,
    isLoading: rolesLoading,
    isError: rolesIsError,
    error: rolesError,
  } = useGetRolesQuery(undefined)

  const roles: Role[] = useMemo(
    () => (rolesResp as GetRolesResponse | undefined)?.data?.roles ?? [],
    [rolesResp]
  )
  const masterPermissions: Permission[] = useMemo(
    () => (rolesResp as GetRolesResponse | undefined)?.data?.permissions ?? [],
    [rolesResp]
  )

  // Track checkbox state by permission.id
  const [permissionChecks, setPermissionChecks] = useState<
    Record<number, boolean>
  >({})

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: "" },
  })

  // When a role is selected, pre-check the permissions it has
  useEffect(() => {
    const roleIdStr = form.watch("role") // string
    if (!roleIdStr) return

    const roleIdNum = Number(roleIdStr) // number for lookup
    const selectedRole = roles.find((r) => r.id === roleIdNum)
    if (!selectedRole) return

    const checked: Record<number, boolean> = {}
    for (const p of masterPermissions) {
      checked[p.id] = !!selectedRole.permissions.find(
        (rp) => rp.permission_id === p.id
      )
    }
    setPermissionChecks(checked)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("role"), roles, masterPermissions])

  function togglePermission(id: number, next: boolean | "indeterminate") {
    setPermissionChecks((prev) => ({ ...prev, [id]: Boolean(next) }))
  }

  async function onSubmit(values: FormValues) {
    const permissionIds = Object.entries(permissionChecks)
      .filter(([, checked]) => checked)
      .map(([pid]) => Number(pid))

    try {
      await updateAdminRole({
        admin_id: adminId,
        role_id: Number(values.role),
        permission_ids: permissionIds,
      }).unwrap()
    } catch (e) {
      console.error("Update role failed:", e)
    }
  }

  const apiError =
    getApiErrorMessage(error) ?? (isError ? "Update failed." : null)
  const rolesApiError =
    getApiErrorMessage(rolesError) ??
    (rolesIsError ? "Failed to load roles." : null)

  const submitDisabled =
    isLoading || rolesLoading || rolesIsError || !form.watch("role")

  return (
    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Update role</Button>
        </DialogTrigger>

        <DialogContent className="w-full bg-white rounded-[24px] py-8 px-9 lg-md:-w-[640px] border-0 shadow-[0px_4px_34.3px_0px_#00000026]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Update Admin Role
            </h1>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="grid grid-cols-1 gap-[36px]"
            >
              {/* Role Select */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-figtree text-[10px]/[140%] text-[#525252]">
                      Select Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={rolesLoading || rolesIsError}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-1 py-6 border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2">
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
                    <FormMessage className="font-figtree" />
                    {rolesApiError && (
                      <p className="text-red-500 text-xs mt-2">
                        {rolesApiError}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Permissions */}
              <div className="font-figtree grid grid-cols-1 gap-2">
                <h2 className="text-[20px]/[120%] font-bold text-[#0A0116]">
                  Permissions
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {masterPermissions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <Label
                        htmlFor={`perm-${p.id}`}
                        className="font-normal font-figtree text-[16px]/[140%] text-[#232323] cursor-pointer"
                      >
                        {p.name}
                      </Label>
                      <Checkbox
                        id={`perm-${p.id}`}
                        checked={!!permissionChecks[p.id]}
                        onCheckedChange={(checked) =>
                          togglePermission(p.id, checked)
                        }
                        className="h-[19.2px] w-[19.2px] rounded-[4.27px] border border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </div>
                  ))}
                  {!rolesLoading && masterPermissions.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No permissions configured.
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitDisabled}
                className="w-full h-[50px] rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base text-white"
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>

              {apiError && (
                <p className="text-red-500 text-sm font-figtree">{apiError}</p>
              )}
              {data?.success && (
                <p className="text-green-600 text-sm font-figtree">
                  {data.message || "Role updated successfully."}
                </p>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

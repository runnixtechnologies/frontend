"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useRef } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

type Permission = {
  id: number
  name: string
  code: string
  status: number
  created_at: string
  updated_at: string
}

const formSchema = z.object({
  permissionIds: z.array(z.number()).default([]),
})
type FormValues = z.infer<typeof formSchema>

/** Shallow-equality helper */
function arraysEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/** Keeps a stable array ref unless the contents change */
function useShallowStableArray<T>(value: T[]): T[] {
  const ref = useRef<T[]>(value)
  if (
    !arraysEqual(
      ref.current as unknown as number[],
      value as unknown as number[]
    )
  ) {
    ref.current = value
  }
  return ref.current
}

export default function AdminPermissions({
  allPermissions,
  initialPermissionIds = [],
}: {
  allPermissions: Permission[]
  roleId: number
  initialPermissionIds?: number[]
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissionIds: initialPermissionIds,
    },
    mode: "onTouched",
  })

  // Watch permissionIds from RHF
  const watchedPermissionIds =
    useWatch({ control: form.control, name: "permissionIds" }) ?? []

  //  Stabilize with shallow compare (no ESLint complaints, fewer recomputes)
  const selectedPermissionIds = useShallowStableArray(watchedPermissionIds)

  // Build a Set for cheap has() checks
  const selectedSet = useMemo(
    () => new Set<number>(selectedPermissionIds),
    [selectedPermissionIds]
  )

  const togglePermission = (id: number, checked: boolean) => {
    const next = new Set(selectedSet)
    if (checked) next.add(id)
    else next.delete(id)
    form.setValue("permissionIds", Array.from(next), { shouldDirty: true })
  }

  const selectAll = () => {
    form.setValue(
      "permissionIds",
      allPermissions.map((p) => p.id),
      { shouldDirty: true }
    )
  }

  const clearAll = () => {
    form.setValue("permissionIds", [], { shouldDirty: true })
  }

  async function onSubmit(values: FormValues) {
    console.log("values", values)
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full xl:w-[938px] flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={selectAll}>
          Select all
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
          Clear
        </Button>
      </div>

      <div className="rounded-lg border p-4">
        <div className="grid grid-cols-1 gap-3">
          {allPermissions.map((p) => {
            const checked = selectedSet.has(p.id)
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

          {allPermissions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No permissions available.
            </p>
          )}
        </div>
      </div>
    </form>
  )
}

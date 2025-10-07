"use client"

import { useMemo, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { EditIcon } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useGetSingleUserQuery } from "@/lib/redux/api/users"

const schema = z.object({
  vehicle_type: z.string().optional().default(""),
  manufacturer: z.string().optional().default(""),
  model: z.string().optional().default(""),
  year: z.string().optional().default(""),
  color: z.string().optional().default(""),
  license: z.string().optional().default(""),
})
type FormData = z.infer<typeof schema>
type EditableField = keyof FormData

const fieldInputCls =
  "flex-1 pl-1 py-6 border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#7C7C7C]"

export default function VehicleInformation({ userId }: { userId: number }) {
  const { data, isLoading, isError, refetch } = useGetSingleUserQuery(
    { userType: "rider", id: userId },
    { skip: !userId }
  )

  // unwrap {status,message,data} or direct object
  const user: any = useMemo(() => (data as any)?.data ?? data ?? {}, [data])

  // prefer primary vehicle, else first
  const vehicle = useMemo(() => {
    const list = (user?.vehicles as any[]) || []
    return list.find((v) => v?.is_primary) ?? list[0] ?? null
  }, [user])

  // merge rider.* with vehicles[] fallbacks
  const initial: FormData = useMemo(
    () => ({
      vehicle_type: user?.rider?.vehicle_type ?? vehicle?.vehicle_type ?? "",
      manufacturer:
        vehicle?.brand ??
        // sometimes riders put brand in model; keep blank if unknown
        "",
      model: user?.rider?.vehicle_model ?? vehicle?.model ?? "",
      year: vehicle?.year ? String(vehicle.year) : "",
      color: user?.rider?.vehicle_color ?? vehicle?.color ?? "",
      license:
        user?.rider?.license_plate ??
        user?.rider?.license_number ??
        vehicle?.license_plate ??
        "",
    }),
    [user, vehicle]
  )

  const [editing, setEditing] = useState<EditableField | null>(null)
  const [local, setLocal] = useState<FormData>(initial)

  // keep RHF synced to local
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: local,
    values: local,
  })

  const startEdit = (f: EditableField) => {
    setEditing(f)
    form.setValue(f, local[f] ?? "")
  }

  const saveField = async (f: EditableField) => {
    const ok = await form.trigger(f)
    if (!ok) return
    const val = form.getValues(f)
    setLocal((prev) => ({ ...prev, [f]: val }))
    setEditing(null)

    // TODO: wire PATCH here when endpoint is ready
    // await updateRiderVehicle({ userId, [f]: val })
  }

  const cancelEdit = () => {
    if (editing) form.setValue(editing, local[editing] ?? "")
    setEditing(null)
  }

  const renderRow = (f: EditableField, label: string, value: string) => {
    const isEditing = editing === f
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[14px]/[20px] font-medium text-[#525252]">
            {label}
          </Label>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEdit(f)}
              className="h-auto p-1 text-[14px] font-medium text-primary hover:text-primary/70"
            >
              <EditIcon />
              <span className="ml-1 text-sm">Edit</span>
            </Button>
          )}
        </div>

        {isEditing ? (
          <Form {...form}>
            <FormField
              control={form.control}
              name={f}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input {...field} className={fieldInputCls} autoFocus />
                      <div className="flex gap-1 items-center mt-8">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => saveField(f)}
                          className="h-8 w-12 px-4"
                        >
                          save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                          className="h-8 w-8 p-0"
                          title="Cancel"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        ) : (
          <div className="font-figtree font-semibold text-[18px]/[24px] text-[#232323]">
            {value || "—"}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full pr-6 space-y-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full pr-6 space-y-4">
        <p className="text-sm text-red-600">Failed to load vehicle info.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  // no rider vehicle at all
  if (!user?.rider && !vehicle) {
    return (
      <div className="w-full pr-6">
        <p className="text-sm text-[#666]">
          This rider has no vehicle on file yet.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full pr-6 space-y-[48px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderRow("vehicle_type", "Vehicle Type", local.vehicle_type || "")}
        {renderRow(
          "manufacturer",
          "Vehicle Manufacturer",
          local.manufacturer || ""
        )}
        {renderRow("model", "Vehicle Model", local.model || "")}
        {renderRow("year", "Vehicle Year", local.year || "")}
        {renderRow("color", "Vehicle Colour", local.color || "")}
        {renderRow("license", "License Plate", local.license || "")}
      </div>
    </div>
  )
}

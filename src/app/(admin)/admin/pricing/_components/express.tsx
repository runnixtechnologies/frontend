"use client"

import { EditIcon } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  findItemIdByField,
  valuesForType,
  type EditableField,
} from "@/lib/pricingMap"
import {
  useGetAllPricingQuery,
  useUpdatePricingMutation,
  useDeletePricingMutation,
  type ApiPricing,
} from "@/lib/redux/api/pricing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash, X } from "lucide-react"
import { useEffect, useMemo, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/* ---------- static labels (module scope to avoid deps warnings) ---------- */
const FIELD_LABELS: Record<EditableField, string> = {
  base: "Base Fare Price",
  kmPrice: "Price per km",
  minPrice: "Price per minute",
  waitingTime: "Waiting Time fee per minute",
}

/* schema for known mapped fields */
const schema = z.object({
  base: z.string().optional(),
  kmPrice: z.string().optional(),
  minPrice: z.string().optional(),
  waitingTime: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const clsx =
  "flex-1 pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#7C7C7C]"

export default function ExpressDelivery() {
  const kind = "express-delivery" as const

  const { data, isLoading, isError } = useGetAllPricingQuery({ type: kind })

  // memoize items from query to stabilize deps for downstream hooks
  const items = useMemo<ApiPricing[]>(() => data?.items ?? [], [data?.items])

  // compute currentValues only when items/kind change
  const currentValues = useMemo(() => valuesForType(items, kind), [items, kind])

  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [editingExtraId, setEditingExtraId] = useState<number | null>(null)
  const [extraTempValue, setExtraTempValue] = useState<string>("")

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: currentValues,
    mode: "onChange",
  })

  useEffect(() => {
    form.reset(currentValues)
  }, [currentValues]) // eslint-disable-line react-hooks/exhaustive-deps

  const [updatePricing, { isLoading: isSaving }] = useUpdatePricingMutation()
  const [deletePricing, { isLoading: isDeleting }] = useDeletePricingMutation()

  // stable ref to check existence of known field
  const hasField = useCallback(
    (field: EditableField) => Boolean(findItemIdByField(items, kind, field)),
    [items, kind]
  )

  /* ---------- Known fields handlers ---------- */
  const handleEdit = (field: EditableField) => {
    setEditingField(field)
    form.setValue(field, currentValues[field] ?? "")
  }

  const handleSave = async (field: EditableField) => {
    const ok = await form.trigger(field)
    if (!ok) return

    const newValueStr = form.getValues(field) ?? ""
    const id = findItemIdByField(items, kind, field)
    if (!id) return

    await updatePricing({
      id,
      value: Number(newValueStr),
      type: kind,
      is_flat: 1,
      is_percentage: 0,
      status: true,
    }).unwrap()

    setEditingField(null)
  }

  const handleDelete = async (field: EditableField) => {
    const id = findItemIdByField(items, kind, field)
    if (!id) return
    try {
      await deletePricing(id).unwrap()
      if (editingField === field) {
        form.setValue(field, "")
        setEditingField(null)
      }
    } catch (e) {
      console.error("Failed to delete pricing:", e)
    }
  }

  const handleCancel = () => {
    if (editingField)
      form.setValue(editingField, currentValues[editingField] ?? "")
    setEditingField(null)
  }

  /* ---------- Extras (dynamic items) logic, but rendered in the SAME grid ---------- */

  // Which item IDs are the known mapped fields?
  const knownIds = useMemo(() => {
    const ids: number[] = []
    ;(Object.keys(FIELD_LABELS) as EditableField[]).forEach((f) => {
      const id = findItemIdByField(items, kind, f)
      if (id) ids.push(id)
    })
    return new Set(ids)
  }, [items, kind])

  // Extras are items for this type not covered by knownIds
  const extraItems = useMemo(
    () =>
      items
        .filter((it) => it.type === kind && !knownIds.has(it.id))
        .sort((a, b) => b.id - a.id),
    [items, kind, knownIds]
  )

  const startEditExtra = (item: ApiPricing) => {
    setEditingExtraId(item.id)
    setExtraTempValue(String(item.value ?? ""))
  }

  const saveExtra = async (item: ApiPricing) => {
    if (!extraTempValue || isNaN(Number(extraTempValue))) return
    await updatePricing({
      id: item.id,
      value: Number(extraTempValue),
      type: item.type,
      is_flat: item.is_flat,
      is_percentage: item.is_percentage,
      status: Boolean(item.status),
    }).unwrap()
    setEditingExtraId(null)
    setExtraTempValue("")
  }

  const cancelExtra = () => {
    setEditingExtraId(null)
    setExtraTempValue("")
  }

  const deleteExtra = async (item: ApiPricing) => {
    try {
      await deletePricing(item.id).unwrap()
      if (editingExtraId === item.id) cancelExtra()
    } catch (e) {
      console.error("Failed to delete pricing:", e)
    }
  }

  /* ---------- Renderers ---------- */
  const renderField = (field: EditableField, label: string, value: string) => {
    const isEditing = editingField === field

    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[14px]/[20px] font-medium text-[#525252]">
            {label}
          </Label>
          <div className="flex items-center gap-1">
            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(field)}
                  className="h-auto p-1 text-primary hover:text-primary/70"
                  disabled={isLoading || isSaving || isError}
                >
                  <EditIcon />
                  <span className="ml-1 text-sm">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(field)}
                  className="h-auto p-1 text-destructive hover:text-destructive/70"
                  disabled={isLoading || isDeleting || isError}
                >
                  <Trash className="h-4 w-4" />
                  <span className="ml-1 text-sm">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </span>
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <Form {...form}>
            <FormField
              control={form.control}
              name={field}
              render={({ field: formField }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        {...formField}
                        className={clsx}
                        autoFocus
                        inputMode="decimal"
                      />
                      <div className="flex gap-1 items-center mt-8">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSave(field)}
                          className="h-8 w-fit px-4"
                          disabled={isSaving}
                        >
                          {isSaving ? "Saving" : "save"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          className="h-8 w-8 p-0"
                          disabled={isSaving}
                        >
                          <X className="h-4 w-4" />
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
          <div className="font-semibold text-[18px]/[24px] text-[#232323]">
            {value || (isLoading ? "…" : "—")}
          </div>
        )}
      </div>
    )
  }

  const renderExtra = (item: ApiPricing) => {
    const isEditing = editingExtraId === item.id
    return (
      <div key={item.id} className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[14px]/[20px] font-medium text-[#525252]">
            {item.option}
          </Label>
          <div className="flex items-center gap-1">
            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditExtra(item)}
                  className="h-auto p-1 text-primary hover:text-primary/70"
                  disabled={isLoading || isSaving || isError}
                >
                  <EditIcon />
                  <span className="ml-1 text-sm">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteExtra(item)}
                  className="h-auto p-1 text-destructive hover:text-destructive/70"
                  disabled={isLoading || isDeleting || isError}
                >
                  <Trash className="h-4 w-4" />
                  <span className="ml-1 text-sm">Delete</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={extraTempValue}
              onChange={(e) => setExtraTempValue(e.target.value)}
              className={clsx}
              autoFocus
              inputMode="decimal"
            />
            <div className="flex gap-1 items-center mt-8">
              <Button
                type="button"
                size="sm"
                onClick={() => saveExtra(item)}
                className="h-8 w-fit px-4"
                disabled={isSaving}
              >
                {isSaving ? "Saving" : "save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cancelExtra}
                className="h-8 w-8 p-0"
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="font-semibold text-[18px]/[24px] text-[#232323]">
            {String(item.value ?? "—")}
          </div>
        )}
      </div>
    )
  }

  // Known fields we should render (those that exist on the server)
  const fieldsToRender = (Object.keys(FIELD_LABELS) as EditableField[]).filter(
    hasField
  )

  return (
    <div className="w-full pr-6 space-y-[36px]">
      <h3 className="font-bold text-[24px]/[32px] text-[#313335]">
        Express Delivery
      </h3>

      {/* Single unified grid: known fields first, then dynamic extras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
        {fieldsToRender.map((field) => (
          <div key={field}>
            {renderField(field, FIELD_LABELS[field], currentValues[field])}
          </div>
        ))}

        {extraItems.map((item) => (
          <div key={item.id}>{renderExtra(item)}</div>
        ))}
      </div>
    </div>
  )
}

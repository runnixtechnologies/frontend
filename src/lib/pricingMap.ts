import type { ApiPricing } from "@/lib/redux/api/pricing"

export type EditableField = "base" | "kmPrice" | "minPrice" | "waitingTime"

export const FIELD_TO_OPTIONS: Record<EditableField, string[]> = {
  base: ["Base Fee Price", "Base Fare Price"],
  kmPrice: ["Price per km"],
  minPrice: ["Price per minute"],
  waitingTime: ["Waiting Time fee per minute"],
}

export function findItemIdByField(
  items: ApiPricing[],
  kind: "express-delivery" | "standard-delivery",
  field: EditableField
) {
  console.log("items,kind,field", items, kind, field)
  const options = FIELD_TO_OPTIONS[field].map((s) => s.toLowerCase())
  const hit = items.find(
    (p) => p.type === kind && options.includes(p.option.toLowerCase())
  )
  return hit?.id
}

export function valuesForType(
  items: ApiPricing[],
  kind: "express-delivery" | "standard-delivery"
) {
  // returns numeric strings, defaulting to ""
  const getVal = (field: EditableField) => {
    const id = findItemIdByField(items, kind, field)
    const v = items.find((i) => i.id === id)?.value
    return v !== undefined && v !== null ? String(v) : ""
  }
  return {
    base: getVal("base"),
    kmPrice: getVal("kmPrice"),
    minPrice: getVal("minPrice"),
    waitingTime: getVal("waitingTime"),
  }
}

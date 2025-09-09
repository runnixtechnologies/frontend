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
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const profileSchema = z.object({
  base: z.string().min(1, "Vehicle base is required"),
  kmPrice: z.string().min(1, "Last name is required"),
  minPrice: z.string().min(1, "minPrice name is required"),
  waitingTime: z.string().min(1, "waitingTime number is required"),
})
type ProfileFormData = z.infer<typeof profileSchema>

const initialData: ProfileFormData = {
  base: "1500",
  kmPrice: "250",
  minPrice: "200",
  waitingTime: "100",
}

type EditableField = keyof ProfileFormData
const clsx =
  "flex-1 pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"

export default function ExpressDelivery() {
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [priceData, setpriceData] = useState<ProfileFormData>(initialData)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: priceData,
  })

  const handleEdit = (field: EditableField) => {
    setEditingField(field)
    form.setValue(field, priceData[field])
  }

  const handleSave = async (field: EditableField) => {
    const isValid = await form.trigger(field)
    if (isValid) {
      const newValue = form.getValues(field)
      setpriceData((prev) => ({ ...prev, [field]: newValue }))
      setEditingField(null)
    }
  }

  const handleCancel = () => {
    if (editingField) {
      form.setValue(editingField, priceData[editingField])
    }
    setEditingField(null)
  }

  const renderField = (
    field: EditableField,
    label: string,
    value: string,
    inputType: "input" = "input"
  ) => {
    const isEditing = editingField === field

    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[14px]/[20px] font-medium text-[#525252] tracking-normal">
            {label}
          </Label>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(field)}
              className="h-auto p-1 text-[14px]/[20px] font-medium text-primary tracking-normal hover:text-primary/70"
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
              name={field}
              render={({ field: formField }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {inputType === "input" && (
                        <Input {...formField} className={clsx} autoFocus />
                      )}

                      <div className="flex gap-1 items-center mt-8">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSave(field)}
                          className="h-8 w-12 px-4 cursor-pointer"
                        >
                          save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          className="h-8 w-8 p-0 cursor-pointer"
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
          <div className="font-figtree font-semibold text-[18px]/[24px] text-[#232323] -tracking-[2%]">
            {value}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full pr-6 space-y-[36px]">
      <h3 className="font-figtree font-bold text-[24px]/[32px] text-[#313335] -tracking-[2%]">
        Express Delivery
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
        {renderField("base", "Base Fare Price", priceData.base)}
        {renderField("kmPrice", "Price per km", priceData.kmPrice)}
        {renderField("minPrice", "Price per minute", priceData.minPrice)}
        {renderField(
          "waitingTime",
          "Waiting Time fee per minute",
          priceData.waitingTime
        )}
      </div>
    </div>
  )
}

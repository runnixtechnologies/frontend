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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select a gender",
  }),
  email: z.string().email("Please enter a valid email address"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
})
type ProfileFormData = z.infer<typeof profileSchema>

const initialData: ProfileFormData = {
  firstName: "Kenton",
  lastName: "Patrick",
  phoneNumber: "07438 652 465",
  gender: "Male",
  email: "name@gmail.com",
  city: "Freetown",
  address: "81 Youthful Close, Windsor, N74 2SY",
}

type EditableField = keyof ProfileFormData
const clsx =
  "flex-1 pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
export default function RiderInformation() {
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [profileData, setProfileData] = useState<ProfileFormData>(initialData)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  })

  const handleEdit = (field: EditableField) => {
    setEditingField(field)
    form.setValue(field, profileData[field])
  }

  const handleSave = async (field: EditableField) => {
    const isValid = await form.trigger(field)
    if (isValid) {
      const newValue = form.getValues(field)
      setProfileData((prev) => ({ ...prev, [field]: newValue }))
      setEditingField(null)
    }
  }

  const handleCancel = () => {
    if (editingField) {
      form.setValue(editingField, profileData[editingField])
    }
    setEditingField(null)
  }

  const renderField = (
    field: EditableField,
    label: string,
    value: string,
    inputType: "input" | "select" | "textarea" = "input"
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
              className="h-auto p-1 text-[14px]/[20px] hover:bg-transparent cursor-pointer font-medium text-primary tracking-normal hover:text-primary/70"
            >
              <EditIcon />
              <span className="ml-1">Edit</span>
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
                      {inputType === "select" && field === "gender" && (
                        <Select
                          value={formField.value}
                          onValueChange={formField.onChange}
                        >
                          <SelectTrigger className={clsx}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {inputType === "textarea" && (
                        <Textarea
                          {...formField}
                          className="flex-1 min-h-[60px] pl-1 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b  placeholder:text-[#7C7C7C]"
                          autoFocus
                        />
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
    <div className="w-full pr-6 space-y-[48px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderField("firstName", "First Name", profileData.firstName)}
        {renderField("lastName", "Last Name", profileData.lastName)}
        {renderField("phoneNumber", "Phone Number", profileData.phoneNumber)}
        {renderField("gender", "Gender", profileData.gender, "select")}
        {renderField("email", "Email Address", profileData.email)}
        {renderField("city", "City", profileData.city)}
      </div>

      <div className="w-full">
        {renderField("address", "Address", profileData.address, "textarea")}
      </div>
    </div>
  )
}

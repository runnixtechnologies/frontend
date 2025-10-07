"use client"

import { useState } from "react"
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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getApiErrorMessage } from "@/lib/getApiErrorMessage"
import { useCreatePricingMutation } from "@/lib/redux/api/pricing"

const schema = z.object({
  option: z.string().min(2, "Option is required"),
  value: z.coerce.number().min(0, "Value must be ≥ 0"),
  type: z.enum(["express-delivery", "standard-delivery"], {
    required_error: "Select a type",
  }),
  is_flat: z.boolean().default(true),
  is_percentage: z.boolean().default(false),
  status: z.boolean().default(true),
})
type FormValues = z.infer<typeof schema>

export function CreatePrice() {
  const [open, setOpen] = useState(false)
  const [createPricing, { isLoading, isError, error, data }] =
    useCreatePricingMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      option: "",
      value: 0,
      type: "express-delivery",
      is_flat: true,
      is_percentage: false,
      status: true,
    },
    mode: "onTouched",
  })

  async function onSubmit(values: FormValues) {
    try {
      await createPricing({
        option: values.option,
        value: values.value,
        type: values.type,
        is_flat: values.is_flat ? 1 : 0,
        is_percentage: values.is_percentage ? 1 : 0,
        status: values.status,
      }).unwrap()
      form.reset({
        option: "",
        value: 0,
        type: "express-delivery",
        is_flat: true,
        is_percentage: false,
        status: true,
      })
      setOpen(false)
    } catch {}
  }

  const apiError =
    getApiErrorMessage(error) ?? (isError ? "Creation failed." : null)
  const success =
    (data as any)?.status === "00"
      ? (data as any)?.message || "Price created."
      : null

  return (
    <div className="flex flex-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create price</Button>
        </DialogTrigger>

        <DialogContent className="w-full bg-white rounded-[24px] py-8 px-9 border-0 shadow-[0px_4px_34.3px_0px_#00000026]">
          <DialogTitle className="text-[#0A0116] font-figtree font-bold text-[28px]/[36px]">
            Create Pricing
          </DialogTitle>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="grid grid-cols-1 gap-7"
            >
              {/* Option */}
              <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-figtree text-[10px] text-[#525252]">
                      Option
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g. "Late Price"'
                        className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-figtree text-xs" />
                  </FormItem>
                )}
              />

              {/* Value + Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-figtree text-[10px] text-[#525252]">
                        Value (₦)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder="100"
                          className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage className="font-figtree text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-figtree text-[10px] text-[#525252]">
                        Type
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-0 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 dark:text-[#232323] hover:border-b placeholder:text-[#7C7C7C] aria-invalid:border-0 aria-invalid:border-b-2">
                            <SelectValue placeholder="Select delivery type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="font-figtree">
                          <SelectItem value="express-delivery">
                            Express Delivery
                          </SelectItem>
                          <SelectItem value="standard-delivery">
                            Standard Delivery
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-figtree text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="is_flat"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2 cursor-pointer">
                      <FormLabel className="font-figtree text-[14px] text-[#232323]">
                        Is Flat
                      </FormLabel>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(c) => field.onChange(Boolean(c))}
                        className="h-[18px] w-[18px] rounded-[4px] border border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_percentage"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="font-figtree text-[14px]">
                        Is Percentage
                      </FormLabel>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(c) => field.onChange(Boolean(c))}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="font-figtree text-[14px]">
                        Active
                      </FormLabel>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(c) => field.onChange(Boolean(c))}
                      />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[44px] rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-white"
              >
                {isLoading ? "Creating…" : "Create Price"}
              </Button>

              {apiError && (
                <p className="text-red-500 text-sm font-figtree">{apiError}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm font-figtree">{success}</p>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

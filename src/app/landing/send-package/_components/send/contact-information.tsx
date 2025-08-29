"use client"

import { AngleBack } from "@/components/svgs"
import { CountryCodePicker } from "@/components/svgs/CountryCodePicker"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z.object({
  receiver: z.string().min(2, {
    message: "Receiver name is required.",
  }),
  receiverPhoneNumberCode: z
    .string({
      required_error: "Please select country code from the dropdown",
    })
    .min(1, { message: "Please select your country code from the dropdown" }),
  receiverPhoneNumber: z
    .string({ required_error: "Receiver phone number is required" })
    .min(6, { message: "Phone number is too short (minimum 6 digits)" })
    .max(15, { message: "Phone number is too long (maximum 15 digits)" })
    .refine((phone) => /^[0-9\-\s]+$/.test(phone), {
      message: "Phone number can only contain digits, spaces, and hyphens",
    }),
  sender: z.string().min(2, {
    message: "Sender name is required.",
  }),
  senderPhoneNumberCode: z
    .string({
      required_error: "Please select country code from the dropdown",
    })
    .min(1, { message: "Please select your country code from the dropdown" }),

  senderPhoneNumber: z
    .string({ required_error: "Sender phone number is required" })
    .min(6, { message: "Phone number is too short (minimum 6 digits)" })
    .max(15, { message: "Phone number is too long (maximum 15 digits)" })
    .refine((phone) => /^[0-9\-\s]+$/.test(phone), {
      message: "Phone number can only contain digits, spaces, and hyphens",
    }),
  note: z
    .string({ required_error: "Please enter your message" })
    .min(5, { message: "Message is too short" }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

interface PackageInformationProps {
  prevStep: () => void
  nextStep: () => void
}

export default function PackageInformation({
  nextStep = () => {},
  prevStep = () => {},
}: PackageInformationProps) {
  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiver: "",
      receiverPhoneNumber: "",
      receiverPhoneNumberCode: "+234",
      sender: "",
      senderPhoneNumber: "",
      senderPhoneNumberCode: "+234",
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    console.log("Form data:", data)
    nextStep()
  }

  return (
    <div className="space-y-6">
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault()
          prevStep()
        }}
        className="flex gap-1 items-center text-[#7C7C7C] mb-6"
      >
        <AngleBack /> Go back
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold text-[#36264F] mb-6">
        Contact Details
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Receiver's Name */}
          <FormField
            control={form.control}
            name="receiver"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm/[140%] font-normal text-[#525252]">
                  Receiver&apos;s Name:
                </FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5" />
                  <FormControl>
                    <Input
                      placeholder="Enter Receiver's Name"
                      className="pl-10 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#BDBDBD]"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Receiver Phone Number */}
          <div className="flex flex-col gap-2">
            <FormLabel htmlFor="phone">Receiver&apos;s Phone Number</FormLabel>
            <div className="flex flex-col gap-[2px] w-full relative">
              <div className="absolute -left-1 top-0 h-full px-3 py-2 text-[#404452] hover:bg-transparent hover:text-[#404452] cursor-pointer z-10">
                <FormField
                  control={form.control}
                  name="receiverPhoneNumberCode"
                  render={({ field }) => (
                    <CountryCodePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="+234"
                    />
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="receiverPhoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="receiverPhoneNumber"
                        type="tel"
                        placeholder="xxx xxxx xxx"
                        {...field}
                        className="pl-[110px] py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#BDBDBD]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <h3 className="font-bold text-[20px]/[120%] text-[#232323] mb-2 tracking-normal">
            Sender&apos;s Contact Details?
          </h3>
          {/* Sender's Name */}
          <FormField
            control={form.control}
            name="sender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm/[140%] font-normal text-[#525252]">
                  sender&apos;s Name:
                </FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5" />
                  <FormControl>
                    <Input
                      placeholder="Enter Sender's Name"
                      className="pl-10 py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#BDBDBD]"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sender Phone Number */}
          <div className="flex flex-col gap-2">
            <FormLabel htmlFor="phone">Sender&apos;s Phone Number</FormLabel>
            <div className="flex flex-col gap-[2px] w-full relative">
              <div className="absolute -left-1 top-0 h-full px-3 py-2 text-[#404452] hover:bg-transparent hover:text-[#404452] cursor-pointer z-10">
                <FormField
                  control={form.control}
                  name="senderPhoneNumberCode"
                  render={({ field }) => (
                    <CountryCodePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="+234"
                    />
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="senderPhoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="senderPhoneNumber"
                        type="tel"
                        placeholder="xxx xxxx xxx"
                        {...field}
                        className="pl-[110px] py-6 focus:border-x-transparent focus:border-t-transparent border-0 border-b rounded-none focus:outline-none focus:ring-0 focus:border-b-2 hover:border-0 hover:border-b placeholder:text-[#BDBDBD]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Message */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Note to rider" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-[46px] py-3 px-5 rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base leading-[120%] -tracking-[2%] text-white"
          >
            Send Request
          </Button>
        </form>
      </Form>
    </div>
  )
}

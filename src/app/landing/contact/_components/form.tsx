"use client"

import { MessageIcon } from "@/components/svgs"
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
import { useAddContactMutation } from "@/lib/redux/api/contact"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Interest / Complaints options
const interestOptions = [
  "Deliveries / Order",
  "Partnership / Business",
  "Operations / Riders / Vendors",
  "General Enquiries",
] as const

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  countryCode: z
    .string({
      required_error: "Please select your country code from the dropdown",
    })
    .min(1, { message: "Please select your country code from the dropdown" }),
  phoneNumber: z
    .string({ required_error: "Please enter your phone number" })
    .min(6, { message: "Phone number is too short (minimum 6 digits)" })
    .max(15, { message: "Phone number is too long (maximum 15 digits)" })
    .refine((phone) => /^[0-9\-\s]+$/.test(phone), {
      message: "Phone number can only contain digits, spaces, and hyphens",
    }),
  interest: z
    .array(z.enum(interestOptions))
    .min(1, { message: "Please select at least one option" }),
  message: z
    .string({ required_error: "Please enter your message" })
    .min(5, { message: "Message is too short" }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export default function ContactUsForm() {
  // const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      countryCode: "NG",
      interest: [],
      message: "",
    },
  })
  const [addContactUs, { isLoading }] = useAddContactMutation()

  // Handle form submission
  async function onSubmit(data: FormValues) {
    const inputData = {
      fullname: data?.name,
      email: data?.email,
      phone: data?.phoneNumber,
      interest_complaints: data?.interest,
      message: data?.message,
    }
    try {
      const response = await addContactUs(inputData).unwrap()
      if (
        response?.message
          .toLowerCase()
          .includes("email already exists in the database")
      ) {
        const options = {
          duration: 5000,
          description: response.message,
          className: "light-toast",
          style: {
            color: "#ffffff",
            background: "#cc0000",
          },
        }
        // setIsSubmitted(false)
        toast.error("Failed to submit waitlist form", options)
      } else {
        // setIsSubmitted(true)
        form.reset()
      }
    } catch (error: unknown) {
      console.log("error", error)
    }
  }

  return (
    <div className="min-h-[672px] w-full relative" id="contact-us">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      className={`${
                        emailExists ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        // Clear the email exists error when user types
                        if (emailExists) {
                          setEmailExists(false)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {emailExists && (
                    <p className="text-sm font-normal font-figtree text-red-500 mt-1">
                      This email is already on our waitlist.
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <div className="flex flex-col gap-[2px] w-full relative">
                <div className="absolute -left-1 top-0 h-full px-3 py-2 text-[#404452] hover:bg-transparent hover:text-[#404452] cursor-pointer z-10">
                  <FormField
                    control={form.control}
                    name="countryCode"
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="xxx xxxx xxx"
                          {...field}
                          className="pl-[110px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Interest / Complaints - Checkboxes */}
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest / Complaints</FormLabel>
                  <div className="grid grid-cols-1 sm-md:grid-cols-2 gap-2 mt-2">
                    {interestOptions.map((option) => (
                      <label
                        key={option}
                        className="dark:text-white flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={field.value?.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value ?? []), option])
                            } else {
                              field.onChange(
                                (field.value ?? []).filter((v) => v !== option)
                              )
                            }
                          }}
                          className="h-4 w-4 rounded border-input accent-primary"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Feel free to ask any questions about our services or share anything interesting with us."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit */}
          <div className="mt-[36px]">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] py-3 px-5 rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base leading-[120%] -tracking-[2%] text-white"
            >
              {isLoading ? "Submitting..." : "Send Message"} <MessageIcon />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

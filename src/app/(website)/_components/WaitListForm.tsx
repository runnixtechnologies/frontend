"use client"

import {
  InstagramAltIcon,
  LinkedinAltIcon,
  TiktokAltIcon,
  TwitterAltIcon,
} from "@/components/svgs"
import { WaitlistIcon } from "@/components/svgs/waitlist_icon"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { socials } from "@/lib/data"
import { useAddToWaitlistMutation } from "@/lib/redux/api/waitlistApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["merchant", "users", "rider"], {
    required_error: "Please select a role.",
  }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

// Define error response type
interface ErrorResponse {
  status?: number
  data?: {
    message?: string
    error?: string
  }
  message?: string
  error?: string
}

const labelStyle = `font-bold font-figtree text-base text-[#232323] leading-[120%] -tracking-[2%]`
const inputStyle = `w-full h-[54px] font-normal font-figtree text-base leading-[120%] -tracking-[2%] border border-solid outline-none focus:outline-none focus:border-0 ring-0 focus:ring-0 focus:shadow-none border-[#E5E7EB] hover:border-[#7F5BAE] focus:border-[#7F5BAE] rounded-xl p-4 bg-[#EFEFEF] text-[#232323] placeholder:capitalize placeholder:text-[#989898]`

export default function WaitlistForm() {
  const [open, setOpen] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  // Add the RTK Query mutation hook
  const [addToWaitlist, { isLoading }] = useAddToWaitlistMutation()

  // Handle form submission
  async function onSubmit(data: FormValues) {
    // Reset email exists state
    setEmailExists(false)

    try {
      const response = await addToWaitlist(data).unwrap()
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
        setIsSubmitted(false)
        toast.error("Failed to submit waitlist form", options)
      } else {
        setIsSubmitted(true)
        form.reset()
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse

      // Check if the error is about email already existing
      const errorMessage =
        err.data?.message ||
        err.data?.error ||
        err.message ||
        err.error ||
        "An error occurred"

      if (
        errorMessage.toLowerCase().includes("email already exists") ||
        errorMessage.toLowerCase().includes("already registered") ||
        errorMessage.toLowerCase().includes("email is already in use")
      ) {
        setEmailExists(true)
        form.setError("email", {
          type: "manual",
          message: "This email is already on our waitlist.",
        })
      } else {
        let message = "An error occurred"

        if (err.message === "Network Error") {
          message = "Please check your network connectivity"
        } else if (err.data?.message) {
          message = err.data.message
        } else if (err.data?.error) {
          message = err.data.error
        } else if (err.message) {
          message = err.message
        } else if (err.error) {
          message = err.error
        }
        const options = {
          duration: 5000,
          description: message,
          className: "light-toast",
          style: {
            color: "#ffffff",
            background: "#cc0000",
          },
        }
        toast.error("Failed to submit waitlist form", options)
      }
    }
  }

  return (
    <div
      className="bg-[#7F5BAE] min-h-[792px] w-full relative py-8 sm:py-12 md:py-16 lg:py-24 xl:py-30"
      id="waitlist"
    >
      <div
        className="w-full h-full absolute inset-0 bg-repeat opacity-15"
        style={{
          backgroundImage: `url('/images/waitlist-pattern.png')`,
          backgroundSize: "100px 100px",
        }}
      ></div>

      {isSubmitted ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white dark:bg-white w-full md:w-[640px] flex justify-center items-center py-16 px-12 rounded-3xl">
            <DialogClose>
              <span className="absolute right-2 top-2 bg-white flex justify-center items-center cursor-pointer z-10">
                <X
                  className="text-[#202426] w-[36px] h-[36px]"
                  onClick={() => setIsSubmitted(false)}
                />
              </span>
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="max-w-[544px] flex flex-col gap-[36px]">
              <WaitlistIcon />
              <DialogHeader>
                <DialogTitle className="font-figtree font-bold text-[28px] tracking-[2%] text-center text-[#232323]">
                  You&apos;re now on the list! 🎉
                </DialogTitle>
                <DialogDescription className="font-figtree font-normal text-sm/[120%] -tracking-[2%] text-center text-[#525252]">
                  Thank you for joining the Runnix waitlist. You&apos;re now one
                  step closer to experiencing seamless, reliable deliveries in
                  your area. We&apos;ll keep you updated on our launch and
                  exclusive early access opportunities. Stay tuned!
                </DialogDescription>
              </DialogHeader>
              <div className="w-full flex justify-center items-center gap-6 sm:gap-9">
                {socials?.map((social, index) => (
                  <Link
                    key={index}
                    href={social.link}
                    target="_blank"
                    className="cursor-pointer"
                  >
                    {social.name === "x" ? (
                      <TwitterAltIcon />
                    ) : social.name === "instagram" ? (
                      <InstagramAltIcon />
                    ) : social.name === "tiktok" ? (
                      <TiktokAltIcon />
                    ) : social.name === "linkedin" ? (
                      <LinkedinAltIcon />
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div
          className="mx-auto h-full w-full max-w-[1440px] flex flex-col items-center justify-center px-4 sm:px-6"
          data-aos="fade-up"
        >
          <Card className="w-full max-w-md mx-auto bg-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl leading-[120%] -tracking-[2%] font-bold font-figtree text-[#232323] text-center">
                Join the Runnix Revolution
              </CardTitle>
              <CardDescription className="text-sm lg:text-base leading-[140%] -tracking-[2%] text-[#626A62] font-normal font-figtree text-center">
                Sign up today and be among the first to experience the future of
                logistics in underserved areas!
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter your name"
                            className={inputStyle}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-figtree" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Email</FormLabel>
                        <FormControl>
                          <Input
                            className={`${inputStyle} ${
                              emailExists
                                ? "border-red-500 focus:border-red-500"
                                : ""
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
                        <FormMessage className="font-figtree" />
                        {emailExists && (
                          <p className="text-sm font-medium text-red-500 mt-1">
                            This email is already on our waitlist.
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>
                          Interested Role
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${inputStyle} !h-[54px] min-h-[54px]`}
                            >
                              <SelectValue
                                placeholder="select your role"
                                className="text-[#989898] capitalize"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="font-figtree">
                            <SelectItem value="users">User</SelectItem>
                            <SelectItem value="merchant">Merchant</SelectItem>
                            <SelectItem value="rider">Rider</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-figtree" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="mt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[54px] py-4 px-5 rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base leading-[120%] -tracking-[2%] text-white"
                  >
                    {isLoading ? "Submitting..." : "Join Waitlist"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      )}
    </div>
  )
}

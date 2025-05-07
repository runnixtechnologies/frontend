"use client"

import { MessageIcon } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTitle } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  comment: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export default function LeaveComment() {
  const [open, setOpen] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      comment: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    console.log("data", data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 cursor-pointer hover:bg-transparent"
        >
          <MessageIcon className="dark:text-white text-[#232323" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#161226] w-[calc(100%-24px)] max-w-[90vw] xs:max-w-[85vw] md:max-w-[640px] h-auto max-h-[90vh] xs:max-h-[85vh] sm:max-h-[650px] overflow-y-auto grid grid-cols-1 py-6 px-0 sm:p-6 xs:p-8 md:p-9 gap-[16px] xs:gap-[20px] sm:gap-[24px] shadow-[0px_12px_30px_0px_#0000001A] xs:shadow-[0px_16px_40px_0px_#0000001A] sm:shadow-[0px_22px_49px_0px_#0000001A]">
        <DialogTitle className="flex flex-col gap-1">
          <span className="font-figtree font-bold text-[28px]/[120%] dark:text-[#DCDCDC] text-[#232323]">
            Leave a Comment
          </span>
          <span className="font-figtree font-normal text-[16px]/[140%] dark:text-[#DCDCDC] text-[#525252]">
            Your email address will not be published. Required fields are
            marked.
          </span>
        </DialogTitle>
        <DialogClose className="absolute right-2 xs:right-4 top-2 md:top-4 bg-white dark:bg-[#161226] flex justify-center items-center cursor-pointer z-10">
          <X className="dark:text-white text-[#202426] w-6 h-6 xs:w-[30px] xs:h-[30px] md:w-[36px] md:h-[36px]" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="w-full flex flex-col gap-[16px] xs:gap-[20px] sm:gap-[24px] justify-center items-center">
          <div className="w-full flex flex-col gap-[20px] xs:gap-[28px] sm:gap-[36px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-5">
                  {/* Comment */}
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your comment"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
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
                          <FormMessage />
                          {emailExists && (
                            <p className="text-sm font-normal font-figtree text-red-500 mt-1">
                              This email is already on our waitlist.
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="mt-[36px]">
                  <Button
                    type="submit"
                    className="w-full h-[46px] py-3 px-5 rounded-xl bg-[#7F5BAE] hover:bg-[#6a4c93] font-figtree font-bold text-base leading-[120%] -tracking-[2%] text-white"
                  >
                    Send Comment <MessageIcon />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

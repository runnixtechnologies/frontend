"use client"

import { useState, useTransition } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { DialogTitle } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { toast } from "sonner"

/* -------------------------------------------------------------------------- */
/*  Zod schema                                                                */
/* -------------------------------------------------------------------------- */
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  comment: z.string().min(2, "Comment must be at least 2 characters"),
})

type FormValues = z.infer<typeof schema>

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */
interface LeaveCommentProps {
  slug: string
}

export default function LeaveComment({ slug }: LeaveCommentProps) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()
  const [emailExists, setEmailExists] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", comment: "" },
  })

  async function postComment(values: FormValues) {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, slug }),
    })
    if (res.status === 201) {
      toast.success("Comment submitted successfully")
      form.reset()
      setOpen(false)
    } else if (res.status === 409) {
      setEmailExists(true)
    } else {
      const { message } = await res.json()
      toast.error(message || "Something went wrong")
    }
  }

  function onSubmit(values: FormValues) {
    start(() => postComment(values))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0 hover:bg-transparent">
          <MessageIcon className="text-[#232323] dark:text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-[#161226] w-[90vw] max-w-md sm:max-w-lg overflow-y-auto p-6 xs:p-8 space-y-6 shadow-lg">
        <DialogTitle className="space-y-1">
          <span className="font-figtree font-bold text-2xl dark:text-[#DCDCDC]">
            Leave a Comment
          </span>
          <span className="font-figtree text-sm text-[#525252] dark:text-[#DCDCDC]">
            Your email address will not be published. Required fields are
            marked.
          </span>
        </DialogTitle>

        <DialogClose className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted">
          <X className="h-6 w-6 text-[#202426] dark:text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your comment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className={emailExists ? "border-red-500" : ""}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (emailExists) setEmailExists(false)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {emailExists && (
                      <p className="text-sm text-red-500 mt-1">
                        This email already commented.
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#7F5BAE] hover:bg-[#6a4c93] text-white"
              disabled={pending}
            >
              {pending ? "Sending…" : "Send Comment"}{" "}
              <MessageIcon className="ml-2" />
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

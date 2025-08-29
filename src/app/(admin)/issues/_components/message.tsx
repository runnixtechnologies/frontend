"use client"

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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTitle } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/* -------------------------------------------------------------------------- */
/*  Zod schema                                                                */
/* -------------------------------------------------------------------------- */
const schema = z.object({
  reply: z.string().min(2, "Reply must be at least 2 characters"),
})

type FormValues = z.infer<typeof schema>

export default function ReplyMessage({ message }: { message: string }) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reply: "" },
  })

  async function postComment(values: FormValues) {
    // const res = await fetch("/api/comments", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ ...values, reply }),
    // })
    // if (res.status === 201) {
    //   toast.success("Reply submitted successfully")
    //   form.reset()
    //   setOpen(false)
    // }
    console.log("values", values)
  }

  function onSubmit(values: FormValues) {
    start(() => postComment(values))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="font-figtree font-medium text-primary text-[12px]/[160px] -tracking-[2%] flex gap-1 items-center cursor-pointer"
        >
          <MessageIcon /> See Message
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white w-[90vw] lg:w-[640px] overflow-y-auto p-9 xs:p-8 space-y-9 rounded-[16px] shadow-[0px_12px_52px_-6px_#1D202733]">
        <div className="flex flex-col gap-6">
          <DialogTitle className="border-b border-[#DCDCDC] pb-2">
            <span className="font-figtree font-bold text-2xl">Message</span>
          </DialogTitle>

          <DialogClose className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted">
            <X className="h-6 w-6 text-[#202426]" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="flex flex-col gap-6">
          <span className="font-figtree font-normal text-[18px]/[160%] text-[#525252] -tracking[1%]">
            {message}
          </span>
          <Separator className="text-[#DCDCDC]" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="reply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reply</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Send Response" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end items-end">
              <Button
                type="submit"
                className="w-fit opacity-50 bg-[#7F5BAE] hover:bg-[#6a4c93] text-white"
                disabled={pending}
              >
                {pending ? "Sending…" : "Send Response"}{" "}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

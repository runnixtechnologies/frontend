"use client"

import { MessageIcon } from "@/components/svgs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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
import { useMemo, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useGetMyProfileQuery } from "@/lib/redux/api/account"

const schema = z.object({
  reply: z.string().min(2, "Reply must be at least 2 characters"),
})
type FormValues = z.infer<typeof schema>

type Props = {
  message: string
  /** Role ID that this issue has been assigned to */
  assignedRoleId?: number | null
  /** Optional: for future server post (issue id) */
  issueId?: string | number
}

export default function ReplyMessage({
  message,
  assignedRoleId,
  issueId,
}: Props) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()

  // who am I?
  const { data: me } = useGetMyProfileQuery()
  const myRoleId = useMemo(
    () => (me as any)?.data?.role?.id as number | undefined,
    [me]
  )

  const canReply = useMemo(() => {
    // allow only if the issue is assigned and my role matches it
    if (assignedRoleId == null) return false
    if (myRoleId == null) return false
    return Number(myRoleId) === Number(assignedRoleId)
  }, [assignedRoleId, myRoleId])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reply: "" },
  })

  async function postComment(values: FormValues) {
    if (!canReply) return
    // TODO: wire to your reply API endpoint, e.g.:
    // await replyToIssue({ issueId, message: values.reply }).unwrap()
    console.log("reply payload:", { issueId, message: values.reply })
    form.reset()
    setOpen(false)
  }

  function onSubmit(values: FormValues) {
    if (!canReply) return
    start(() => postComment(values))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="font-figtree font-medium text-primary text-[12px]/[160%] -tracking-[2%] flex gap-1 items-center cursor-pointer"
        >
          <MessageIcon /> See Message
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white w-[90vw] lg:w-[640px] overflow-y-auto p-9 xs:p-8 space-y-9 rounded-[16px] shadow-[0px_12px_52px_-6px_#1D202733]">
        <div className="flex flex-col gap-6">
          <DialogTitle className="border-b border-[#DCDCDC] pb-2">
            <span className="font-figtree font-bold text-2xl">Message</span>
          </DialogTitle>
        </div>

        <div className="flex flex-col gap-6">
          <span className="font-figtree font-normal text-[18px]/[160%] text-[#525252]">
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
                  <div className="flex items-center justify-between">
                    <FormLabel className="mb-2">Reply</FormLabel>
                    {!canReply && (
                      <span className="text-xs text-[#9A9A9A]">
                        Only the <strong>assigned role</strong> can reply.
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder={
                        canReply
                          ? "Type your response…"
                          : "You don't have permission to reply to this issue"
                      }
                      {...field}
                      disabled={!canReply || pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end items-end">
              <Button
                type="submit"
                className="w-fit bg-[#7F5BAE] hover:bg-[#6a4c93] text-white disabled:opacity-60"
                disabled={!canReply || pending}
              >
                {pending ? "Sending…" : "Send Response"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

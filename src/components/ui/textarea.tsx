import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-[#DCDCDC] placeholder:text-[#BDBDBD] focus-visible:border-primary focus-visible:ring-none aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:bg-transparent flex field-sizing-content min-h-37 w-full rounded-[8px] border bg-transparent p-4 text-base/[120%] shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-stone-800 dark:placeholder:text-stone-400 dark:focus-visible:border-primary dark:focus-visible:ring-none dark:dark:aria-invalid:ring-none dark:aria-invalid:border-red-900 dark:dark:bg-transparent resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

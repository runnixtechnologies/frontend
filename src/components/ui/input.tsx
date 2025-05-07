import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#9C9A9E] selection:bg-primary selection:text-primary-foreground border border-solid border-[#DCDCDC] bg-transparent hover:border-[#7F5BAE] dark:border-stone-800 focus:border-primary rounded-[8px] outline-none focus:outline-none focus:border-0 ring-0 focus:ring-0 focus:shadow-none flex h-12 w-full min-w-0 p-4 text-base/[120%] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-normal font-figtree tracking-normal text-[#232323] dark:text-white placeholder:capitalize ",
        "focus-visible:border focus-visible:ring-primary focus-visible:ring-0",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

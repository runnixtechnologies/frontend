"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-primary data-[active=true]:bg-white data-[active=true]:ring-transparent data-[active=true]:aria-invalid:ring-red-500/20 aria-invalid:border-red-500 data-[active=true]:aria-invalid:border-red-500 dark:bg-stone-200/30 border-[#EFEFEF] bg-[#EFEFEF] relative flex h-[72px] w-[70.67px] items-center justify-center border-y border text-sm shadow-none transition-all outline-none rounded-md data-[active=true]:z-10 data-[active=true]:ring-none dark:data-[active=true]:border-stone-300 dark:data-[active=true]:ring-transparent dark:data-[active=true]:aria-invalid:ring-transparent dark:dark:data-[active=true]:aria-invalid:ring-transparent dark:aria-invalid:border-red-900 dark:data-[active=true]:aria-invalid:border-red-900 dark:dark:bg-stone-800/30 dark:border-stone-800 md:text-sm font-normal font-figtree tracking-normal text-[#232323] dark:text-white placeholder:capitalize ",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-[#181B18] h-4 w-px duration-1000 dark:bg-white" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"
import { twMerge } from "tailwind-merge"

interface WaitListButtonProps {
  className?: string
  buttonText?: string
  pageSettings?: object
  utm?: object
  prefill?: object
}

const WaitListButton: React.FC<WaitListButtonProps> = ({
  className = "",
  buttonText = "Join the Waitlist",
}) => {
  return (
    <div>
      <Button
        variant="default"
        className={twMerge(
          "bg-primary h-[46px] py-[12px] px-[20px] rounded-[12px] border border-solid border-primary font-figtree font-bold text-white text-lg leading-[120%] -tracking-[2%] cursor-pointer",
          className
        )}
      >
        <Link href="#waitlist">{buttonText}</Link>
      </Button>
    </div>
  )
}

export default WaitListButton

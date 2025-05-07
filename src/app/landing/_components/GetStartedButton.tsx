"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"
import { twMerge } from "tailwind-merge"

interface WaitListButtonProps {
  className?: string
  buttonText?: string
  link?: string
}

const GetStartedButton: React.FC<WaitListButtonProps> = ({
  className = "",
  buttonText = "Become a Merchant",
  link = "/",
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
        <Link href={link}>{buttonText}</Link>
      </Button>
    </div>
  )
}

export default GetStartedButton

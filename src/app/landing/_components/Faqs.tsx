"use client"

import { questions } from "@/lib/data"
import { cn } from "@/lib/utils"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import * as React from "react"

// Custom Accordion components
const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-left group",
        className
      )}
      {...props}
    >
      {children}
      <div className="w-[38px] h-[38px] border border-[#DCDCDC] rounded flex justify-center items-center transition-all">
        <ChevronDown className="h-5 w-5 md:h-6 md:w-6 dark:text-white text-black shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = "AccordionContent"

export default function FAQsSection() {
  // Calculate the number of rows in the grid
  const totalItems = questions.length
  const lastItemIndex = totalItems - 1
  const secondLastItemIndex = totalItems - 2

  return (
    <div className="w-full  min-h-[436px] dark:bg-[#1D192B] bg-white pt-0 pb-10 md:pt-16 lg:pt-[80px] lg:pb-[120px] flex justify-center items-center xl:px-[164px]">
      <div className="w-full 2xl:w-[1200px] px-5 sm:px-6.5 md:px-8 lg:px-[44px] 2xl:px-[38px] 3xl:px-[24px] flex flex-col gap-6 md:gap-10 lg:gap-[64px]">
        <div className="w-full flex flex-col gap-[20px]">
          <h4 className="w-full font-figtree font-bold text-3xl md:text-4xl lg:text-[48px]/[44px] -tracking-[2%] dark:text-white text-black text-center">
            Frequently Asked Questions
          </h4>
          <div className="w-full flex justify-center items-center">
            <Image
              alt="fag vector image"
              src="/faq-vector.svg"
              width={314}
              height={13}
              className="w-[314px] h-[13px]"
            />
          </div>
        </div>
        <Accordion
          type="single"
          collapsible
          className="grid grid-cols-1 gap-4 xl:gap-[48px] w-full xl:grid-cols-2"
        >
          {questions?.map((question, index) => {
            // For single column layout (mobile to lg)
            const isLastItem = index === lastItemIndex

            // For two column layout (xl and above)
            // If total is odd, last item in first column is at index (totalItems - 1) / 2
            // If total is even, last items are at totalItems - 1 and totalItems - 2
            const isLastInColumn =
              (totalItems % 2 === 0 &&
                (index === lastItemIndex || index === secondLastItemIndex)) ||
              (totalItems % 2 === 1 &&
                (index === lastItemIndex ||
                  index === Math.floor(totalItems / 2) - 1))

            return (
              <AccordionItem
                value={`item-${index + 1}`}
                key={question.id}
                className={cn(
                  "w-full",
                  "border-t border-[#DCDCDC]",
                  isLastItem ? "border-b border-[#DCDCDC]" : "",
                  isLastInColumn
                    ? "xl:border-b xl:border-[#DCDCDC]"
                    : "xl:border-b-0"
                )}
              >
                <AccordionTrigger
                  className={cn(
                    "font-inter font-normal tracking-normal align-middle dark:text-white text-black",
                    "text-sm sm:text-[13px] md:text-[14px] lg:text-[15.25px]",
                    "leading-5 md:leading-6"
                  )}
                >
                  {question.question}
                </AccordionTrigger>
                <AccordionContent
                  className={cn(
                    "font-inter font-normal tracking-normal align-middle dark:text-white text-black",
                    "text-xs sm:text-[12px] md:text-[13px] lg:text-sm",
                    "leading-5 md:leading-6"
                  )}
                >
                  {question.answer}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}

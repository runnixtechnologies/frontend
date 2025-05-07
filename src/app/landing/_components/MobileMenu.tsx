"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

export const menu = [
  { name: "Home", link: "/landing" },
  { name: "Sell", link: "/landing/sell" },
  { name: "Ride", link: "/landing/ride" },
  { name: "FAQs", link: "/landing/faqs" },
  { name: "Blog", link: "/landing/blog" },
  { name: "Contact us", link: "/landing/contact" },
]
export function MobileMenu({
  pathname,
}: {
  closeDrawer: () => void
  pathname: string
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between pb-30">
      <div className="w-full">
        {menu.map((item, index) => {
          // If the menu item has sub-pages, render as accordion item

          // If the menu item has no sub-pages, render as a direct link
          return (
            <div key={index} className="py-4 border-b">
              <Link
                href={item.link}
                className={cn(
                  "text-sm text-[#202426] dark:text-white leading-5 font-inter font-medium tracking-normal align-middle hover:underline",
                  pathname === item.link && "text-primary font-semibold"
                )}
              >
                {item.name}
              </Link>
            </div>
          )
        })}
      </div>
      <div className="w-full flex flex-col gap-[12px]">
        <Link
          href="/signin"
          className="w-full h-[22px]  flex justify-center items-center  font-figtree font-bold text-[16px]/[140%] tracking-normal text-black dark:text-white"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="w-full h-[35px] py-2 px-4  flex justify-center items-center gap-1 rounded-xl font-figtree font-bold text-[16px]/[140%] bg-[#232323] dark:bg-primary text-white -tracking-[2%]"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}

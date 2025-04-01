"use client"
import {
  InstagramAltIcon,
  LinkedinAltIcon,
  TiktokAltIcon,
  TwitterAltIcon,
} from "@/components/svgs"
import DarkBgLogo from "@/components/svgs/dark_bg-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { socials } from "@/lib/data"
import Link from "next/link"

export default function Footer() {
  const today = new Date()

  return (
    <footer className="w-full py-6 bg-[#232323] flex justify-center items-center px-4 sm:px-6 md:px-10 lg:px-24 z-10">
      <div className="w-full h-full  max-w-[1440px] flex flex-col gap-6 xl:gap-8 lg:gap-[72px] xl:flex-row justify-between text-left">
        {/* Logo */}
        <DarkBgLogo className="w-[100px] sm:w-[120px] xl:w-1[143px]" />

        {/* Copyright Large screens */}
        <span className="hidden lg:flex text-[#989898] text-sm lg:text-base leading-snug tracking-normal font-normal font-figtree max-w-[345px]">
          © {today.getFullYear()} Runnix Technologies. All rights reserved.
        </span>

        {/* Links and Socials */}
        <div className="w-full xl:w-[520px] flex flex-col md:flex-row gap-4 sm:gap-6 justify-between items-start xl:justify-end">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-9">
            <ThemeToggle />
            <Link
              href="/"
              className="text-[#989898] text-sm sm:text-base font-figtree hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-[#989898] text-sm sm:text-base font-figtree hover:underline underline-offset-4"
            >
              Contact Us
            </Link>
          </div>
          <div className="flex gap-6 sm:gap-9">
            {socials?.map((social, index) => (
              <Link
                key={index}
                href={social.link}
                target="_blank"
                className="cursor-pointer"
              >
                {social.name === "x" ? (
                  <TwitterAltIcon />
                ) : social.name === "instagram" ? (
                  <InstagramAltIcon />
                ) : social.name === "tiktok" ? (
                  <TiktokAltIcon />
                ) : social.name === "linkedin" ? (
                  <LinkedinAltIcon />
                ) : null}
              </Link>
            ))}
          </div>
        </div>
        {/* Copyright */}
        <span className="flex lg:hidden text-[#989898] text-sm lg:text-base leading-snug tracking-normal font-normal font-figtree max-w-[345px]">
          © {today.getFullYear()} Runnix Technologies. All rights reserved.
        </span>
      </div>
    </footer>
  )
}

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
      <div className="w-full h-full 2xl:w-[1200px] 3xl:w-[1400px] flex flex-col gap-6 xl:gap-8 lg:gap-[72px] 2xl:flex-row justify-between text-left">
        {/* Logo */}
        <div className="w-full h-full flex flex-col xl:flex-row justify-between items-center">
          <DarkBgLogo className="w-[100px] sm:w-[120px] xl:w-1[143px]" />
          {/* Copyright Large screens */}
          <span className="hidden 2xl:flex text-[#989898] text-sm lg:text-base leading-snug tracking-normal font-normal font-figtree max-w-[365px]">
            © {today.getFullYear()} Runnix Technologies. All rights reserved.
          </span>

          {/* Links and Socials */}
          <div className="w-full xl:w-[520px] flex flex-col md:flex-row gap-4 sm:gap-6 justify-between items-start xl:justify-end">
            <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-9">
              <ThemeToggle />
              <Link
                href="/"
                className="text-[#989898] text-sm 2xl:text-base font-figtree hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="text-[#989898] text-sm 2xl:text-base font-figtree hover:underline underline-offset-4"
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
        </div>
        {/* Copyright */}
        <span className="w-full flex 2xl:hidden text-[#989898] text-sm lg:text-base leading-snug tracking-normal font-normal font-figtree">
          © {today.getFullYear()} Runnix Technologies. All rights reserved.
        </span>
      </div>
    </footer>
  )
}

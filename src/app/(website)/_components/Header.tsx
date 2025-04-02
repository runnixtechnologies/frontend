"use client"
import {
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  TwitterIcon,
} from "@/components/svgs"
import AppLogo from "@/components/svgs/logo"
import Link from "next/link"
import { FC } from "react"
import WaitListButton from "./WaitListButton"
import { socials } from "@/lib/data"
import DarkBgLogo from "@/components/svgs/dark_bg-logo"

export const Header: FC = () => {
  return (
    <div className="w-full relative">
      <header className="w-full h-auto py-4 md:py-6 pl-4 pr-3 sm-md:px-6 lg:px-10 xl:px-16 flex items-center border-b border-transparent z-[20] bg-transparent">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          {/* Logo */}
          <Link href="/" className="w-fit">
            <AppLogo className="dark:hidden w-[114px] h-[36px] sm:w-[130px] md:w-[153px] sm:h-[40px] md:h-[48px]" />
            <DarkBgLogo className="dark:block hidden w-[114px] h-[36px] sm:w-[130px] md:w-[153px] sm:h-[40px] md:h-[48px]" />
          </Link>

          {/* Right Section */}
          <div className="w-fit flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            {/* Social Medias */}
            <div className="hidden lg:flex items-center gap-4 sm:gap-6">
              {socials?.map((social, index) => (
                <Link
                  key={index}
                  href={social.link}
                  target="_blank"
                  className="cursor-pointer"
                >
                  {social.name === "x" ? (
                    <TwitterIcon />
                  ) : social.name === "instagram" ? (
                    <InstagramIcon />
                  ) : social.name === "tiktok" ? (
                    <TiktokIcon />
                  ) : social.name === "linkedin" ? (
                    <LinkedinIcon />
                  ) : null}
                </Link>
              ))}
            </div>
            {/* CTA Button */}
            <WaitListButton className="w-full sm:w-auto" />
          </div>
        </div>
      </header>
    </div>
  )
}

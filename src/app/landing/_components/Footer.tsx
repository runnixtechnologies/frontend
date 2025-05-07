"use client"
import {
  FaceBookAltIcon,
  InstagramAltIcon,
  LinkedinAltIcon,
  TiktokAltIcon,
  TwitterAltIcon,
} from "@/components/svgs"
import DarkBgLogo from "@/components/svgs/dark_bg-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { socials } from "@/lib/data"
import Link from "next/link"
import { menu } from "./MobileMenu"
import TrackOrder from "./Track-Order"

export default function Footer() {
  const today = new Date()
  const footerMenu = [
    { name: "Contact Us", link: "/landing/contact" },
    { name: "Privacy Policy", link: "/landing/privacy-policy" },
  ]
  return (
    <footer className="w-full min-h-[190px] py-6 bg-[#232323] flex flex-col gap-6  justify-center items-center px-4 sm:px-6 md:px-10 lg:px-24 z-10">
      <div className="w-full h-full max-w-[1440px] flex flex-col gap-6 xl:gap-8 lg:gap-[72px] xl:flex-row justify-between text-left">
        <DarkBgLogo className="w-[100px] sm:w-[120px] xl:w-1[143px]" />
        {/* MENU */}
        <div className="w-[525px] h-full xl:h-[48px] hidden xl:flex items-center gap-[36px] ">
          {menu?.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className={
                "font-normal font-figtree text-sm text-[#989898] tracking-normal cursor-pointer hover:text-primary hover:underline underline-offset-4"
              }
            >
              {item.name}
            </Link>
          ))}
          {footerMenu?.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className={
                "font-normal font-figtree text-sm text-[#989898] tracking-normal cursor-pointer hover:text-primary hover:underline underline-offset-4"
              }
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="w-[285px] flex items-center gap-6">
          <ThemeToggle />
          <Link
            href="/signin"
            className="w-fit h-[22px]  flex justify-center items-center  font-figtree font-bold text-[16px]/[140%] tracking-normal text-white"
          >
            Sign In
          </Link>
          <TrackOrder />
        </div>
      </div>
      {/* SOCIALS */}
      <div className="w-full flex justify-start xl:justify-center items-start xl:items-center">
        <div className="w-[200px] h-[24px] flex justify-between gap-1">
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
              ) : social.name === "facebook" ? (
                <FaceBookAltIcon />
              ) : null}
            </Link>
          ))}
        </div>
      </div>
      <p className="flex text-[#989898] text-sm leading-[44px]g tracking-normal font-normal font-figtree max-w-[345px] text-center">
        © {today.getFullYear()} Runnix Technologies. All rights reserved.
      </p>
    </footer>
  )
}

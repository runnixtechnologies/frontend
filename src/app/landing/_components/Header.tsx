"use client"
import DarkBgLogo from "@/components/svgs/dark_bg-logo"
import AppLogo from "@/components/svgs/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { menu, MobileMenu } from "./MobileMenu"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { MenuIcon } from "@/components/svgs"
import TrackOrder from "./Track-Order"

export const Header: FC = () => {
  const pathname = usePathname()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Close drawer when pathname changes
  useEffect(() => {
    setIsDrawerOpen(false)
  }, [pathname])

  return (
    <div className="w-full relative">
      <header className="w-full h-auto py-4 md:py-6 pl-4 pr-3 sm-md:px-6 lg:px-10 xl:px-16 flex items-center border-b border-transparent z-[20] bg-transparent">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex gap-[80px]">
            {/* Logo */}
            <Link href="/">
              <AppLogo className="dark:hidden  w-[114px] h-[36px] sm:w-[130px] md:w-[153px] sm:h-[40px] md:h-[48px]" />
              <DarkBgLogo className="dark:block hidden w-[114px] h-[36px] sm:w-[130px] md:w-[153px] sm:h-[40px] md:h-[48px]" />
            </Link>
            <div className="w-[464px] hidden xl:flex items-center gap-[36px] ">
              {menu.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  className={
                    pathname === item.link
                      ? "font-semibold font-figtree text-[16px]/[100%] text-primary tracking-normal cursor-pointer"
                      : "font-normal font-figtree text-[16px]/[100%] dark:text-white text-black tracking-normal cursor-pointer hover:text-primary"
                  }
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Right Section */}
          <div className="w-[333px] h-[35px]  hidden xl:flex  items-center gap-6">
            <Link
              href="/landing/send-package"
              className="w-fit h-[22px] font-figtree font-bold text-[16px]/[140%] tracking-normal flex justify-center items-center text-black dark:text-white"
            >
              Send Package
            </Link>
            <Link
              href="/signin"
              className="w-fit h-[22px] font-figtree font-bold text-[16px]/[140%] tracking-normal flex justify-center items-center text-black dark:text-white"
            >
              Login
            </Link>
            <TrackOrder />
          </div>
        </div>
        <div className="xl:hidden" onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon />
        </div>
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-full max-w-[300px] h-screen dark:bg-[#161226] bg-white z-[200] p-6"
            >
              <div className="flex justify-end items-end mb-8">
                <button onClick={() => setIsDrawerOpen(false)}>
                  <X size={24} className="text-secondary dark:text-white" />
                </button>
              </div>
              <MobileMenu
                pathname={pathname}
                closeDrawer={() => setIsDrawerOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}

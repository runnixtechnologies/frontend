"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import Footer from "./_components/Footer"
import { Header } from "./_components/Header"
import { useTheme } from "next-themes"
import AOS from "aos"
import "aos/dist/aos.css"

export default function LandingRootLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render gradient after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      offset: 100,
      delay: 200,
      mirror: false,
      anchorPlacement: "top-bottom",
    })
    // Cleanup function to refresh AOS
    return () => {
      AOS.refresh()
    }
  }, [])

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {mounted && (
        <>
          <div className="hidden xl:block absolute inset-0 h-full xl:h-screen z-1">
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/images/dark-hero_img.webp"
                  : "/images/light-hero_img.webp"
              }
              alt="Map background"
              fill
              className="object-cover"
              priority
              quality={20}
            />
          </div>
          <div className="block xl:hidden absolute inset-0 h-full xl:h-screen z-1">
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/images/small-dark-hero_img.webp"
                  : "/images/small-light-hero_bg.webp"
              }
              alt="Map background for small screen"
              fill
              className="object-cover"
              priority
              quality={20}
            />
          </div>
        </>
      )}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

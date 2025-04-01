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
      duration: 600,
      easing: "ease-in-out",
      once: false,
      offset: 100,
      delay: 100,
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
        <div
          className={`absolute inset-0 z-0 ${
            resolvedTheme === "dark" ? "bg-gradient-dark" : "bg-gradient-light"
          }`}
        ></div>
      )}
      <div className="absolute inset-0 h-full xl:h-screen opacity-5 z-10">
        <Image
          src="/images/hero_bg-img.webp"
          alt="Map background"
          fill
          className="object-cover"
          priority
          quality={80}
        />
      </div>
      <div className="relative z-20 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

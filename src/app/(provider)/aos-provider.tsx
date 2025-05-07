"use client"
import AOS from "aos"
import "aos/dist/aos.css"
import { ReactNode, useEffect } from "react"

export default function AOSProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      // easing: "ease-in-out",
      once: true,
      offset: 120,
      // delay: 200,
      // mirror: false,
      // anchorPlacement: "top-bottom",
    })
    // Cleanup function to refresh AOS
    const handleRefresh = () => AOS.refresh()
    window.addEventListener("load", handleRefresh)
    return () => window.removeEventListener("load", handleRefresh)
  }, [])

  return <>{children}</>
}

import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home | Runnix",
  description: "Runnix landing page",
}

export default function LandingRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

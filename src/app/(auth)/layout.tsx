import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication | Runnix",
  description: "Runnix authentication page",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className="bg-white dark:bg-white min-h-screen flex flex-col gap-6 justify-center items-center"
      style={{ background: "white !important" }}
    >
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </div>
  )
}

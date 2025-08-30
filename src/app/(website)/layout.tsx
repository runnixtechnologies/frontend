import { Metadata } from "next"
import WebsiteRootLayout from "."

export const metadata: Metadata = {
  title: "Home | Runnix",
  description: "Runnix landing page. Your one to to all delivery in Nigeria",
}

export default function LandingRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <WebsiteRootLayout>{children}</WebsiteRootLayout>
}

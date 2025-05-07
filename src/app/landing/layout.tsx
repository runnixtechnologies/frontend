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
  return <div>{children}</div>
}

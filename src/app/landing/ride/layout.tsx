import { Metadata } from "next"
import { MainHeader } from "../_components/MainHeader"
import Footer from "../_components/Footer"

export const metadata: Metadata = {
  title: "Ride with Runnix | Runnix",
  description: "Runnix riders page",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <MainHeader />
      {children}
      <Footer />
    </div>
  )
}

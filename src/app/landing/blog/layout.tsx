import { Metadata } from "next"
import Footer from "../_components/Footer"
import { MainHeader } from "../_components/MainHeader"

export const metadata: Metadata = {
  title: "Runnix blog | Runnix",
  description: "Runnix blog page",
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

import { Metadata } from "next"
import { MainHeader } from "../_components/MainHeader"
import Footer from "../_components/Footer"

export const metadata: Metadata = {
  title: "Contact Us | Runnix",
  description: "Runnix contact us page",
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

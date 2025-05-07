import { Metadata } from "next"
import { MainHeader } from "../_components/MainHeader"
import Footer from "../_components/Footer"

export const metadata: Metadata = {
  title: "Send Or Receive Package | Runnix",
  description: "Send or receive pakage on Runnix",
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

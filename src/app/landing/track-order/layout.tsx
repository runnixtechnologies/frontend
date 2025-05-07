import { Metadata } from "next"
import { MainHeader } from "../_components/MainHeader"
import Footer from "../_components/Footer"

export const metadata: Metadata = {
  title: "Track Order | Runnix",
  description: "Runnix track customer orders",
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

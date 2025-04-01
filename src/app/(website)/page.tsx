import HeroSection from "./_components/HeroSection"
import HowItWorksSection from "./_components/HowItWorks"
import OurOfferSection from "./_components/OurOffer"
import OurPurposeSection from "./_components/Purpose"
import SmartDeliverySection from "./_components/SmartDelivery"
import WishListForm from "./_components/WaitListForm"

export default function Home() {
  return (
    <div className="w-full relative flex flex-col" data-aos="fade-up">
      <HeroSection />
      <SmartDeliverySection />
      <OurOfferSection />
      <HowItWorksSection />
      <OurPurposeSection />
      <WishListForm />
    </div>
  )
}

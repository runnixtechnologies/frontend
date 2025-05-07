import RewardSection from "./_components/EarnPoint"
import FAQsSection from "./_components/Faqs"
import HeroSection from "./_components/HeroSection"
import HowItWorksSection from "./_components/HowItWorks"
import OurOfferSection from "./_components/OurOffer"
import OurPurposeSection from "./_components/Purpose"
import RoleSection from "./_components/Roles"
import SmartDeliverySection from "./_components/SmartDelivery"
import DownloadSection from "./_components/DownloadSection"
import TrustAndSecurity from "./_components/TrustAndSecurity"
import LandingRootLayoutWrapper from "."

export default function Home() {
  return (
    <LandingRootLayoutWrapper>
      <HeroSection />
      <SmartDeliverySection />
      <RoleSection />
      <HowItWorksSection />
      <OurOfferSection />
      <RewardSection />
      <OurPurposeSection />
      <TrustAndSecurity />
      <FAQsSection />
      <DownloadSection />
    </LandingRootLayoutWrapper>
  )
}

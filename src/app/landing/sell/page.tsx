import HeroSection from "./_components/HeroSection"
import FAQsSection from "../_components/Faqs"
import HowItWorksSection from "./_components/HowItWorks"
import BusinessesSection from "./_components/KindOfBusiness"
import UnlockGrowthSection from "./_components/UnlockGrowth"
import WhyRunnixSection from "./_components/WhyRunnix"
import DownloadSection from "../_components/DownloadSection"

export default function Sell() {
  return (
    <div className="w-full relative flex flex-col" data-aos="fade-up">
      <HeroSection />
      <WhyRunnixSection />
      <HowItWorksSection />
      <UnlockGrowthSection />
      <BusinessesSection />
      <FAQsSection />
      <DownloadSection />
    </div>
  )
}

import DownloadSection from "../_components/DownloadSection"
import FAQsSection from "../_components/Faqs"
import HeroSection from "./_components/HeroSection"
import HowItWorksSection from "./_components/HowItWorks"
import WhyRunnixSection from "./_components/WhyRunnix"

export default function Ride() {
  return (
    <div className="w-full relative flex flex-col" data-aos="fade-up">
      <HeroSection />
      <WhyRunnixSection />
      <HowItWorksSection />
      <FAQsSection />
      <DownloadSection />
    </div>
  )
}

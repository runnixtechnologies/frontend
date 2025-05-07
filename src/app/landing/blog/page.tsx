import BlogsSection from "./_components/Blogs"
import HeroSection from "./_components/HeroSection"

export default function Blog() {
  return (
    <div className="w-full relative flex flex-col" data-aos="fade-up">
      <HeroSection />
      <BlogsSection />
    </div>
  )
}

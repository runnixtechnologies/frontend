"use client"

export default function HeroSection() {
  return (
    <section
      className="bg-[#3F295B]/50 w-full min-h-[519px] relative xl:pt-10 pb-15 bg-no-repeat bg-cover bg-center flex justify-center items-center"
      aria-label="Hero section"
      style={{ backgroundImage: `url(/blog-hero.svg)` }}
    >
      <div className="w-[full] flex justify-center items-center relative">
        <h1 className="font-figtree font-extrabold text-[54px] xl:text-[64px] leading-[120%] -tracking-[2%] text-center text-white relative top-40">
          Latest News and Stories
        </h1>
      </div>
    </section>
  )
}

"use client"
import {
  CallIcon,
  EmailIcon,
  FaceBookAltIcon,
  InstagramAltIcon,
  LinkedinAltIcon,
  Location,
  TiktokAltIcon,
  TwitterAltIcon,
  WhatsApp,
} from "@/components/svgs"
import Link from "next/link"
import ContactUsForm from "./_components/form"

export default function ContactUs() {
  const phoneE164 = "2347071534107"
  const displayPhone = "08098888763"
  const welcomeMsg = encodeURIComponent(
    "Hi there! I just visited your site and would love to chat."
  )
  const address = "13 Odiyan Street, Ibadan, Oyo, Nigeria"
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`

  return (
    <div
      className="w-full h-full dark:bg-[#161226] bg-white min-h-[519px] relative xl:pt-20 pb-[80px]"
      aria-label="contact us"
    >
      <div className="relative z-10 w-ful h-full flex justify-center items-center px-4 lg:px-6 lg-md:px-8 xl:px-10 2xl:px-[60px] 3xl:px-[80px]">
        <div className="w-full 2xl:w-[1200px] 3xl:w-[1350px] 4xl:w-[1400px]  flex flex-col xl:flex-row items-start justify-start gap-[14px] xl:gap-[80px]">
          {/* Left Section - Text */}
          <div className="w-full xl:w-[576px] flex flex-col gap-[36px] justify-center items-center 2xl:justify-start 2xl:items-start relative">
            <div className="w-full flex flex-col gap-[36px] py-12">
              <div className="flex flex-col gap-2">
                <h1 className="text-[40px]/[120%] font-figtree font-semibold  text-[#36264F] dark:text-white -tracking-[2%]">
                  Get in touch
                </h1>
                <p className="text-left text-[17px] sm-md:text-[16px]/[120%] font-figtree font-light dark:text-white text-[#7C7C7C] max-w-[556.41px]">
                  We are here to help. Contact our team for your needs
                </p>
              </div>

              <ContactUsForm />
            </div>
          </div>
          <div className="w-full h-full xl:w-[576px] py-12">
            <div
              className="w-full h-full  xl:w-[448px] flex flex-col gap-6 min-h-[379px] py-9 px-6 xl:p-9 relative bg-[#25183A] rounded-[20px]"
              data-aos="fade-left"
              style={{
                backgroundImage: `url(/contact-bg.svg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <h4 className="font-figtree font-bold text-[36px]/[120%] -tracking-[2%] text-white">
                Reach out to us on
              </h4>
              <div className="w-full xl:w-[376px] flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <EmailIcon />{" "}
                  <Link
                    href="mailto:runnixtechnologiesltd@gmail.com"
                    className="font-figtree font-medium text-[18px]/[120%] tracking-[-2%] text-white"
                    aria-label="Email Runnix"
                  >
                    runnixtechnologiesltd@gmail.com
                  </Link>
                </div>
                <div className="flex gap-2 items-center">
                  <CallIcon />{" "}
                  <span>
                    <Link
                      href="tel:+2348098888763"
                      className="font-figtree font-medium text-[18px]/[120%] tracking-[-2%] text-white"
                      aria-label="Call Runnix"
                    >
                      08098888763
                    </Link>
                    ,{" "}
                    <Link
                      href="tel:+2347071534107"
                      className="font-figtree font-medium text-[18px]/[120%] tracking-[-2%] text-white"
                      aria-label="Call Runnix"
                    >
                      07071534107
                    </Link>
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <WhatsApp />
                  <Link
                    href={`https://wa.me/${phoneE164}?text=${welcomeMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-figtree font-medium text-[18px]/[120%] tracking-[-2%] text-white"
                    aria-label="Message Runnix on whatsApp"
                  >
                    {displayPhone}
                  </Link>
                </div>
                <div className="flex gap-2 items-center">
                  <Location className="text-[#FF875C]" />
                  <Link
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-figtree font-medium text-[18px]/[120%] tracking-[-2%] text-white"
                  >
                    {address}
                  </Link>
                </div>
                <div className="h-px w-full max-w-7xl bg-[#989898] mx-auto md:h-[2px] lg:h-[3px]" />
                <div className="flex gap-2 items-center">
                  <Link
                    href="https://x.com/RunnixAfrica"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Runnix on X"
                  >
                    <TwitterAltIcon fill="#FF875C" />{" "}
                  </Link>
                  <Link
                    href="https://www.instagram.com/runnixafrica/"
                    aria-label="Runnix on Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramAltIcon fill="#FF875C" />{" "}
                  </Link>
                  <Link
                    href="https://www.tiktok.com/@runnixafrica"
                    aria-label="Runnix on Tiktok"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TiktokAltIcon fill="#FF875C" />{" "}
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/runnixafrica/?viewAsMember=true"
                    aria-label="Runnix on Linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinAltIcon fill="#FF875C" />
                  </Link>
                  <span className="font-figtree font-medium text-[18px]/[120%] tracking-[-2%] text-white">
                    Runnixafrica
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Link
                    href="https://www.facebook.com/runnixafrica"
                    aria-label="Runnix on Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaceBookAltIcon fill="#FF875C" />{" "}
                  </Link>
                  <span className="font-figtree font-medium text-[18px]/[120%] tracking-[-2%] text-white">
                    Runnix
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

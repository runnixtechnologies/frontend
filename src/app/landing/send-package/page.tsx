"use client"
import { useState } from "react"
import SendPackage from "./_components/send"
import ReceivePackage from "./_components/receive"

export default function ContactUs() {
  const [value, setValue] = useState(1)

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
              <div className="bg-[#EFEFEF] w-full lg:w-[580px] h-[85px] flex gap-4 rounded-[24px] p-3">
                <button
                  onClick={() => setValue(1)}
                  className={`w-[270px] h-[61px] flex justify-center items-center gap-[10px] p-4 rounded-[12px] ${
                    value === 1
                      ? "bg-white text-[#232323]"
                      : "bg-transparent text-[#525252]"
                  }  font-figtree  text-[18px]/[140%] tracking-normal align-middle font-semibold transition-all duration-300 cursor-pointer`}
                >
                  Send Package
                </button>
                <button
                  onClick={() => setValue(2)}
                  className={`w-[270px] h-[61px] flex justify-center items-center gap-[10px] p-4 rounded-[12px] ${
                    value === 2
                      ? "bg-white text-[#232323]"
                      : "bg-transparent text-[#525252]"
                  } font-figtree  text-[18px]/[140%] tracking-normal align-middle font-semibold transition-all duration-300 cursor-pointer`}
                >
                  Receive Package
                </button>
              </div>
              {value === 1 ? (
                <SendPackage />
              ) : value === 2 ? (
                <ReceivePackage />
              ) : null}
            </div>
          </div>
          <div className="w-full h-full xl:w-[576px] py-12">
            <div
              className="w-full h-full  xl:w-[448px] flex flex-col gap-6 min-h-[379px] py-9 px-6 xl:p-9 relative bg-[#25183A] rounded-[20px]"
              data-aos="fade-left"
              style={{
                backgroundImage: `url(/images/send-package.webp)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"

export default function DownloadSection() {
  return (
    <div className="dark:bg-[#161226] bg-white/50 w-full flex justify-center items-center">
      <div className="w-full h-full 3xl:w-[1440px] px-0 xl:px-[80px] py-[90px] flex-col gap-[128px] flex justify-center items-center">
        <div className="w-full 3xl:w-[1260px] py-[48px] flex flex-col xl:flex-row gap-[80px] rounded-t-[24px] xl:rounded-[48px] bg-[#7F5BAE] relative">
          <div
            className="w-full h-full absolute inset-0 b-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(/images/download-pattern.png)`,
            }}
          ></div>
          <div className="w-full mx-auto max-w-[1000px] flex flex-col xl:flex-row items-center justify-center gap-[14px] xl:gap-[96px] z-10">
            <div className="w-full xl:w-[599.12px] py-[48px] px-6 flex flex-col gap-[48px]">
              <h4 className="w-full font-figtree font-bold text-white text-[54px]/[110%] xl:text-[75px]/[110%] -tracking-[2%]">
                Download the Runnix App today!
              </h4>
              <div className="w-full h-[48px] md:w-[318px] flex items-center gap-3">
                <Link href="/">
                  <Image
                    width={100}
                    height={100}
                    src="/google-store.svg"
                    alt="Goodle store app link"
                    className="w-auto h-auto"
                  />
                </Link>
                <Link href="/signup">
                  <Image
                    width={100}
                    height={100}
                    src="/apple-store.svg"
                    alt="Apple store app link"
                    className="w-auto h-auto"
                  />
                </Link>
              </div>
            </div>

            <Image
              width={324.88}
              height={480}
              src="/images/mobile.webp"
              alt="Mobile phone image"
              className="w-full h-[482px] xl:w-[484.88px] xl:h-[485.14px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

import React from "react"

export default function MerchantInformation() {
  const merchantInfo = {
    regNumber: "RN5344949309",
    phone: "08080808080",
    email: "name@gmail.com",
    city: "Freetown",
  }
  const operationHours = [
    {
      day: "Sunday",
      open: "",
      close: "",
      available: false,
    },
    {
      day: "Monday",
      open: "9:00 AM",
      close: "5:00 PM",
      available: true,
    },
    {
      day: "Tuesday",
      open: "9:00 AM",
      close: "5:00 PM",
      available: true,
    },
    {
      day: "Wednesday",
      open: "9:00 AM",
      close: "5:00 PM",
      available: true,
    },
    {
      day: "Friday",
      open: "9:00 AM",
      close: "5:00 PM",
      available: true,
    },
    {
      day: "Saturday",
      open: "9:00 AM",
      close: "5:00 PM",
      available: true,
    },
  ]
  return (
    <div className="w-full xl:w-[938px] flex flex-col xl:flex-row gap-4">
      <div className="border-0 xl:border-r xl:border-[#E6E6E6]">
        <div className="w-[505.99px] grid grid-cols-1 gap-[48px]">
          <div className="w-[505.99px] grid grid-cols-1 xl:grid-cols-2 gap-[64px]">
            <div className="flex flex-col gap-[8px]">
              <h4 className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]">
                Registration Number
              </h4>
              <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
                {merchantInfo.regNumber}
              </p>
            </div>
            <div className="flex flex-col gap-[8px]">
              <h4 className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]">
                Phone Number
              </h4>
              <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
                {merchantInfo.phone}
              </p>
            </div>
            <div className="flex flex-col gap-[8px]">
              <h4 className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]">
                Email Address
              </h4>
              <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
                {merchantInfo.email}
              </p>
            </div>
            <div className="flex flex-col gap-[8px]">
              <h4 className="font-figtree font-medium text-[14px]/[20px] tracking-normal text-[#666666]">
                City
              </h4>
              <p className="font-figtree font-semibold text-[18px]/[24px] -tracking-[2%] text-[#4D4D4D]">
                {merchantInfo.city}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8">
        <div className="w-full lg:w-[336px] grid grid-cols-1 gap-[20px]">
          <h3 className="font-figtree font-bold text-[28px]/[120%] tracking-normal text-black">
            Operating Hours
          </h3>
          <div className="w-full flex flex-col gap-4">
            {operationHours?.map((day, index) => (
              <div
                key={index}
                className="w-full flex justify-between items-center"
              >
                <h4 className="text-[#181719] font-figtree font-semibold text-[16px]/[120%] tracking-normal">
                  {day.day}
                </h4>
                {day.available ? (
                  <div className="flex gap-3">
                    <div className="w-fit h-[33px] flex gap-3 p-2 rounded-md border border-[#E4E3E5]">
                      <span className="font-figtree font-medium text-[14px]/[120%] tracking-normal text-[#181719]">
                        {day.open}
                      </span>
                    </div>{" "}
                    <span className="font-figtree font-normal text-[14px]/[140%] tracking-normal text-[#7C7C7C]">
                      to
                    </span>{" "}
                    <div className="w-fit h-[33px] flex gap-3 p-2 rounded-md border border-[#E4E3E5]">
                      <span className="font-figtree font-medium text-[14px]/[120%] tracking-normal text-[#181719]">
                        {day.close}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="font-figtree font-medium text-[14px]/120%] tracking-normal text-[#181719]">
                    Unavailable
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import ContactInformation from "./contact-information"
import PackageInformation from "./package-information"
import PricingInformation from "./price"

export default function SendPackage() {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }
  const previousStep = () => {
    setCurrentStep((prev) => Math.min(prev - 1, 3))
  }
  return (
    <div className="w-full xl:w-[580px]">
      {currentStep === 1 && <PackageInformation nextStep={nextStep} />}

      {currentStep === 2 && (
        <PricingInformation nextStep={nextStep} prevStep={previousStep} />
      )}

      {currentStep === 3 && <ContactInformation prevStep={previousStep} />}
    </div>
  )
}

import OnboardingForm from "@/components/onboarding-form"
import React from "react"

const OnboardingPage = () => {
  return (
    <div className="h-screen w-screen px-4 max-w-[450px] mx-auto flex flex-col items-center justify-center">
      <div className="w-full">
        <OnboardingForm />
      </div>
    </div>
  )
}

export default OnboardingPage

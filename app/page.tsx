"use client"

import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { ShinyButton } from "@/components/magicui/shiny-button"

const images_1 = ["/landing/developer.avif", "/landing/poet.avif"]
const images_2 = ["/landing/student.avif", "/landing/writer.avif"]

export default function Home() {
  return (
    <div className="bg-[#fffefd] h-screen overflow-hidden">
      <div className="md:grid md:grid-cols-2 gap-4 font-sans md:w-[90%] mx-auto px-4">
        <div className="flex flex-col items-center justify-center md:h-screen">
          <div className="md:py-[4rem] py-2">
            <p className="px-4 md:px-4 py-2 bg-gray-100 inline-block rounded-full font-medium text-purple-600">
              #CustomHack
            </p>
            <h3 className="md:text-9xl font-semibold">PolyPen</h3>
            <div className="md:mt-[5rem] md:mb-[2.5rem] md:max-w-[70%]">
              <p className="text-2xl mb-3 md:mb-3 font-medium">
                Real-Time Multilingual Collaborative Writing that translats both
                language and intent.
              </p>
              <p className="text-gray-500">
                Whether a developer is co-writing with a product manager or a
                songwriter, it adapts tone, role, and context in real time.
                It&apos;s not just a writing tool, it&apos;s a handshake between
                every kind of writer.
              </p>
            </div>

            <div className="flex md:flex-row flex-col gap-4 max-w-[550px]">
              <ShimmerButton className="rounded-full w-full h-[50px]">
                Get Started
              </ShimmerButton>
              <ShinyButton className="rounded-full w-full h-[50px]">
                Explore Docs
              </ShinyButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 relative ">
          <div className="space-y-5">
            {images_2.map((image, index) => {
              return (
                <div key={index}>
                  <img
                    src={image}
                    className="h-[60vh] w-full object-cover object-top"
                  />
                </div>
              )
            })}
          </div>
          <div className="space-y-5  -mt-[10rem]">
            {images_1.map((image, index) => {
              return (
                <div key={index}>
                  <img
                    src={image}
                    className="h-[60vh] w-full object-cover object-top"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

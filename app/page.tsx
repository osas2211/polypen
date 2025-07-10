"use client"

import LoginDialog from "@/components/login-dialog"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { ShinyButton } from "@/components/magicui/shiny-button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const images_1 = [
  "/landing/developer.avif",
  "/landing/poet.avif",
  "/landing/teacher.avif",
]
const images_2 = [
  "/landing/student.avif",
  "/landing/writer.avif",
  "/landing/student.avif",
]

interface LoginUser {
  email: string
  id: string
}

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<LoginUser | null>(null)
  const router = useRouter()
  const handleLoginSuccess = (user: LoginUser) => {
    setCurrentUser(user)
    router.push("/dashboard")
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }
  return (
    <div className="bg-[#fffefd] h-screen overflow-hidden">
      <div className="md:grid md:grid-cols-2 gap-4 font-sans md:w-[90%] mx-auto px-4">
        <div className="flex flex-col items-center justify-center md:h-screen">
          <div className="md:py-[4rem] py-2">
            <p className="px-4 md:px-4 py-2 bg-gray-100 inline-block rounded-full font-medium text-lime-600">
              #ZoraCoinathon
            </p>
            <h3 className="md:text-9xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-black to-lime-500">
              PolyPen
            </h3>
            <div className="md:mt-[5rem] md:mb-[2.5rem] md:max-w-[70%]">
              <p className="text-2xl mb-3 md:mb-3 font-medium">
                Real-Time Multilingual Collaborative Writing tool that translats
                both language and intent, and tokenize every document.
              </p>
              <p className="text-gray-500">
                Whether a developer is co-writing with a product manager or a
                songwriter, it adapts tone, role, and context in real time.
                It&apos;s not just a writing tool, it&apos;s a handshake between
                every kind of writer.
              </p>
            </div>

            <div className="flex md:flex-row flex-col gap-4 max-w-[550px]">
              <Link href={"/dashboard"} className="w-full">
                <ShimmerButton className="rounded-full w-full h-[50px]">
                  Launch app
                </ShimmerButton>
              </Link>
              {/* <ShinyButton
                className="rounded-full w-full h-[50px]"
                onClick={() => setIsLoginOpen(true)}
              >
                Launch app
              </ShinyButton> */}
              <div className="w-full"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 relative ">
          <div className="space-y-5 w-full">
            {images_2.map((image, index) => {
              return (
                <div key={index} className="w-full">
                  <img
                    src={image}
                    className="h-[55vh] w-full object-cover object-top"
                  />
                </div>
              )
            })}
          </div>
          <div className="space-y-5  -mt-[25.5vh]">
            {images_1.map((image, index) => {
              return (
                <div key={index} className="w-full">
                  <img
                    src={image}
                    className="h-[55vh] w-full object-cover object-top"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <LoginDialog
        open={isLoginOpen}
        setOpen={setIsLoginOpen}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}

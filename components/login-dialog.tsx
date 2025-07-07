"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Shield, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/utils/supabase"

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
})

type EmailFormData = z.infer<typeof emailSchema>
type OTPFormData = z.infer<typeof otpSchema>

interface LoginDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onLoginSuccess?: (user: { email: string; id: string }) => void
}

type LoginStep = "email" | "otp" | "success"

export default function LoginDialog({
  open,
  setOpen,
  onLoginSuccess,
}: LoginDialogProps) {
  const [currentStep, setCurrentStep] = useState<LoginStep>("email")
  const [userEmail, setUserEmail] = useState("")
  const [otpSentTime, setOtpSentTime] = useState<Date | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  })

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      localStorage.setItem("email", data.email)

      const { data: auth_data, error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: false,
        },
      })
      if (error) {
        throw new Error("")
      }

      setUserEmail(data.email)
      setOtpSentTime(new Date())
      setCurrentStep("otp")
      setResendCooldown(60) // 60 second cooldown

      // Start countdown
      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast.success("OTP Sent", {
        description: `A 6-digit code has been sent to ${data.email}`,
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to send OTP. Please try again.",
      })
    }
  }

  const handleOTPSubmit = async (data: OTPFormData) => {
    try {
      const {
        data: { session, user },
        error,
      } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: data.otp,
        type: "email",
      })

      localStorage.setItem("access-token", session?.access_token!)

      if (error) {
        throw new Error("")
      }

      console.log(session, user)

      // For demo purposes, accept any 6-digit code
      // In real implementation, verify against server
      if (data.otp.length === 6) {
        setCurrentStep("success")

        setTimeout(() => {
          const user = {
            email: userEmail,
            id: Date.now().toString(),
          }

          onLoginSuccess?.(user)
          handleClose()

          toast.success("Login Successful", {
            description: `Welcome back! You're now logged in as ${userEmail}`,
          })
        }, 1500)
      } else {
        throw new Error("Invalid OTP")
      }
    } catch (error) {
      toast.error("Invalid OTP", {
        description: "The code you entered is incorrect. Please try again.",
      })
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOtpSentTime(new Date())
      setResendCooldown(60)

      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast.success("OTP Resent", {
        description: `A new code has been sent to ${userEmail}`,
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to resend OTP. Please try again.",
      })
    }
  }

  const handleClose = () => {
    setCurrentStep("email")
    setUserEmail("")
    setOtpSentTime(null)
    setResendCooldown(0)
    emailForm.reset()
    otpForm.reset()
    setOpen(false)
  }

  const handleBackToEmail = () => {
    setCurrentStep("email")
    otpForm.reset()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep === "email" && (
              <>
                <Mail className="w-5 h-5" />
                Sign In
              </>
            )}
            {currentStep === "otp" && (
              <>
                <Shield className="w-5 h-5" />
                Enter Verification Code
              </>
            )}
            {currentStep === "success" && (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Login Successful
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {currentStep === "email" &&
              "Enter your email address to receive a verification code"}
            {currentStep === "otp" &&
              `We've sent a 6-digit code to ${userEmail}`}
            {currentStep === "success" && "You're being logged in..."}
          </DialogDescription>
        </DialogHeader>

        {/* Email Step */}
        {currentStep === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11"
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}

        {/* OTP Step */}
        {currentStep === "otp" && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  {userEmail}
                </Badge>
              </div>
              {otpSentTime && (
                <p className="text-xs text-slate-500">
                  Code sent at {formatTime(otpSentTime)}
                </p>
              )}
            </div>

            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter 6-digit code"
                          className="h-11 text-center text-lg font-mono tracking-widest"
                          maxLength={6}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "")
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToEmail}
                    className="flex-1 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={otpForm.formState.isSubmitting}
                  >
                    {otpForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Sign In"
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
                className="text-sm"
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Resend verification code"}
              </Button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === "success" && (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                Welcome back!
              </h3>
              <p className="text-sm text-slate-600">
                You're successfully logged in as {userEmail}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-slate-500">Redirecting...</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

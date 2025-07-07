"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { User, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

const roles = [
  { value: "developer", label: "Developer" },
  { value: "poet", label: "Poet" },
  { value: "blogger", label: "Blogger" },
  { value: "musician", label: "Musician" },
  { value: "writer", label: "Writer" },
  { value: "product-manager", label: "Product Manager" },
] as const

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),
  role: z.enum(
    ["developer", "poet", "blogger", "musician", "writer", "product-manager"],
    {
      required_error: "Please select a role",
    }
  ),
})

type FormData = z.infer<typeof formSchema>

export default function OnboardingForm() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(data: FormData) {
    toast.success("Welcome aboard!", {
      description: `Hello ${data.name}! We're excited to have you as a ${
        roles.find((r) => r.value === data.role)?.label
      }.`,
    })
    router.push("/dashboard")

    // Here you would typically send the data to your backend
    // console.log("Form submitted:", data)
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-1">
          <User className="w-6 h-6 text-slate-600" />
        </div>
        <p>test@gmail.com</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">
                    What's your name?
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">
                    What's your role?
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="!h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400 w-full">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-500" />
                          <SelectValue placeholder="Select your role" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Getting started..."
                : "Get Started"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

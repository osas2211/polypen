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
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Briefcase, Globe } from "lucide-react"
import { languages } from "@/utils/languages"
import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { useOnboardUser } from "@/hooks/use-user"
import { useWallet } from "@/contexts/walletContext"

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
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional(),

  role: z.enum(
    ["developer", "poet", "blogger", "musician", "writer", "product-manager"],
    {
      required_error: "Please select a role",
    }
  ),
  language: z
    .string({
      required_error: "Please select a language",
    })
    .min(1, { message: "Please select a language" }),
})

type FormData = z.infer<typeof formSchema>

export default function OnboardingForm() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      language: "",
    },
  })
  const { mutateAsync, isPending } = useOnboardUser()
  const { address, signer } = useWallet()

  async function onSubmit(data: FormData) {
    try {
      const selectedLanguage = languages.find(
        (lang) => lang.code === data.language
      )

      await mutateAsync({
        name: data.name,
        role: data.role,
        wallet_address: address!,
        language: selectedLanguage?.code || "en",
      })
      router.back()
    } catch (error) {
      toast.error("Error", {
        description: "Failed to onboard. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome!</h1>
          <p className="text-slate-600">
            Let's get you set up with a few quick details
          </p>
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
                      What's your username?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="@xyzname"
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
                        <SelectTrigger className="!h-11 w-full border-slate-200 focus:border-slate-400 focus:ring-slate-400">
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

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      What's your preferred language?
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="!h-11 w-full border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-500" />
                            <SelectValue placeholder="Select your language" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-60">
                          {languages.map((language) => (
                            <SelectItem
                              key={language.code}
                              value={language.code}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-mono uppercase w-8">
                                  {language.code}
                                </span>
                                <span>{language.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium"
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
    </div>
  )
}

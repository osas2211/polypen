"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Camera,
  Save,
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  LinkIcon,
  FileText,
  Users,
  Clock,
  Briefcase,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const roles = [
  { value: "developer", label: "Developer" },
  { value: "poet", label: "Poet" },
  { value: "blogger", label: "Blogger" },
  { value: "musician", label: "Musician" },
  { value: "writer", label: "Writer" },
  { value: "product-manager", label: "Product Manager" },
] as const

const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(
    ["developer", "poet", "blogger", "musician", "writer", "product-manager"],
    {
      required_error: "Please select a role",
    }
  ),
  bio: z
    .string()
    .max(500, { message: "Bio must be less than 500 characters" })
    .optional(),
  location: z
    .string()
    .max(100, { message: "Location must be less than 100 characters" })
    .optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
})

type ProfileData = z.infer<typeof profileSchema>

const mockProfile: ProfileData & {
  avatar: string
  joinedDate: string
  documentsCount: number
  collaborationsCount: number
  lastActive: string
} = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "developer",
  bio: "Passionate developer who loves creating beautiful and functional applications. Always learning new technologies and sharing knowledge with the community.",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  avatar: "https://avatar.vercel.sh/john",
  joinedDate: "January 2023",
  documentsCount: 24,
  collaborationsCount: 8,
  lastActive: "2 hours ago",
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(mockProfile)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      role: profile.role,
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProfile((prev) => ({
        ...prev,
        ...data,
        avatar: previewImage || prev.avatar,
      }))

      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      })
    }
  }

  const getRoleIcon = (role: string) => {
    return <Briefcase className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-600" />
              <h1 className="text-xl font-semibold text-slate-900">
                Profile Settings
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 shadow-none h-[45px]">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="activity">Activity & Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture Section */}
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={previewImage || profile.avatar} />
                        <AvatarFallback className="text-2xl">
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-slate-900 hover:bg-slate-800 text-white rounded-full p-2 cursor-pointer transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600">
                        Click the camera icon to upload a new photo
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        JPG, PNG or GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter your full name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                      {field.value && getRoleIcon(field.value)}
                                      <SelectValue placeholder="Select your role" />
                                    </div>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem
                                      key={role.value}
                                      value={role.value}
                                    >
                                      <div className="flex items-center gap-2">
                                        {getRoleIcon(role.value)}
                                        {role.label}
                                      </div>
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
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself..."
                                  className="min-h-[100px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="City, Country"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://yourwebsite.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-800"
                            disabled={form.formState.isSubmitting}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {form.formState.isSubmitting
                              ? "Saving..."
                              : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {profile.documentsCount}
                      </p>
                      <p className="text-sm text-slate-600">Documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {profile.collaborationsCount}
                      </p>
                      <p className="text-sm text-slate-600">Collaborations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Joined
                      </p>
                      <p className="text-sm text-slate-600">
                        {profile.joinedDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Last Active
                      </p>
                      <p className="text-sm text-slate-600">
                        {profile.lastActive}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Summary Card */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={previewImage || profile.avatar} />
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {profile.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        {roles.find((r) => r.value === profile.role)?.label}
                      </Badge>
                    </div>
                    {profile.bio && (
                      <p className="text-slate-600">{profile.bio}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-1">
                          <LinkIcon className="w-4 h-4" />
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{profile.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

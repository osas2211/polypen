"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UserCheck,
  Code,
  Palette,
  BookOpen,
  Music,
  Briefcase,
  Lightbulb,
} from "lucide-react"

interface RoleSelectorProps {
  selectedRole: string
  onRoleChange: (role: string) => void
}

export default function RoleSelector({
  selectedRole,
  onRoleChange,
}: RoleSelectorProps) {
  const roles = [
    { value: "default", label: "Default View", icon: UserCheck },
    { value: "engineer", label: "Engineer", icon: Code },
    { value: "designer", label: "Designer", icon: Palette },
    { value: "poet", label: "Poet", icon: BookOpen },
    { value: "musician", label: "Musician", icon: Music },
    { value: "product-manager", label: "Product Manager", icon: Briefcase },
    { value: "entrepreneur", label: "Entrepreneur", icon: Lightbulb },
  ]

  const currentRole = roles.find((role) => role.value === selectedRole)
  const CurrentIcon = currentRole?.icon || UserCheck

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg py-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
              <CurrentIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-slate-900">
                Reading Perspective
              </div>
              <div className="text-sm text-slate-600">
                {selectedRole === "default"
                  ? "Standard view"
                  : `Optimized for ${currentRole?.label}s`}
              </div>
            </div>
          </div>

          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-48 bg-white/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => {
                const Icon = role.icon
                return (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {role.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

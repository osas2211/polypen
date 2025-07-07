"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Mail,
  MoreHorizontal,
  Crown,
  Edit,
  Eye,
  UserMinus,
} from "lucide-react"

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "editor" | "viewer"
  isOnline: boolean
  lastSeen?: string
}

interface CollaboratorPanelProps {
  collaborators: Collaborator[]
  onAddCollaborator: (email: string) => void
}

export default function CollaboratorPanel({
  collaborators,
  onAddCollaborator,
}: CollaboratorPanelProps) {
  const [inviteEmail, setInviteEmail] = useState("")

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onAddCollaborator(inviteEmail)
      setInviteEmail("")
    }
  }

  const getRoleIcon = (role: Collaborator["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="w-3 h-3" />
      case "editor":
        return <Edit className="w-3 h-3" />
      case "viewer":
        return <Eye className="w-3 h-3" />
    }
  }

  const getRoleBadge = (role: Collaborator["role"]) => {
    const variants = {
      owner: "bg-yellow-100 text-yellow-700",
      editor: "bg-blue-100 text-blue-700",
      viewer: "bg-slate-100 text-slate-700",
    }
    return (
      <Badge variant="secondary" className={`${variants[role]} text-xs`}>
        <span className="mr-1">{getRoleIcon(role)}</span>
        {role}
      </Badge>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="pb-4">
        <SheetTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Collaborators ({collaborators.length})
        </SheetTitle>
      </SheetHeader>

      {/* Invite Section */}
      <div className="space-y-3 pb-4 px-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleInvite()}
          />
          <Button onClick={handleInvite} size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Invited users will receive an email with access to this document
        </p>
      </div>

      <Separator />

      {/* Collaborators List */}
      <ScrollArea className="flex-1 pt-4">
        <div className="space-y-3">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={collaborator.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {collaborator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {collaborator.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {collaborator.name}
                    </p>
                    {getRoleBadge(collaborator.role)}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {collaborator.email}
                  </p>
                  {!collaborator.isOnline && collaborator.lastSeen && (
                    <p className="text-xs text-slate-400">
                      Last seen {collaborator.lastSeen}
                    </p>
                  )}
                </div>
              </div>

              {collaborator.role !== "owner" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Change to Editor
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Change to Viewer
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <UserMinus className="w-4 h-4 mr-2" />
                      Remove Access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          Anyone with the link can view this document
        </p>
      </div>
    </div>
  )
}

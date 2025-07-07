"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  MessageSquare,
  Share2,
  MoreHorizontal,
  UserPlus,
  Clock,
  Eye,
  Settings,
  Save,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"
import TinyMCEEditor from "@/components/tinymce-editor"
import CollaboratorPanel from "@/components/collaborator-panel"
import CommentPanel from "@/components/comment-panel"
import { toast } from "sonner"

interface Document {
  id: string
  title: string
  type:
    | "article"
    | "note"
    | "report"
    | "presentation"
    | "meeting"
    | "draft"
    | "idea"
  content: string
  wordCount: number
  readingTime: string
  lastEdited: string
  status: "draft" | "published" | "archived" | "shared"
  author: string
}

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "editor" | "viewer"
  isOnline: boolean
  lastSeen?: string
}

const mockDocument: Document = {
  id: "1",
  title: "Product Launch Strategy",
  type: "report",
  content: "<p>Write your content here...</p>",
  wordCount: 0,
  readingTime: "0 min read",
  lastEdited: "Just now",
  status: "draft",
  author: "You",
}

const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://avatar.vercel.sh/john",
    role: "owner",
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "https://avatar.vercel.sh/sarah",
    role: "editor",
    isOnline: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "https://avatar.vercel.sh/mike",
    role: "viewer",
    isOnline: false,
    lastSeen: "2 hours ago",
  },
]

export default function DocumentEditor({ documentId }: { documentId: string }) {
  const router = useRouter()

  const [document, setDocument] = useState<Document>(mockDocument)
  const [collaborators, setCollaborators] =
    useState<Collaborator[]>(mockCollaborators)
  const [docText, setDocText] = useState(document.content)
  const [isCollaboratorPanelOpen, setIsCollaboratorPanelOpen] = useState(false)
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDocument((prev) => ({
      ...prev,
      content: docText,
      lastEdited: "Just now",
    }))
    setIsSaving(false)
    toast.success("Document saved", {
      description: "Your changes have been saved successfully.",
    })
  }

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-700"
      case "published":
        return "bg-green-100 text-green-700"
      case "shared":
        return "bg-blue-100 text-blue-700"
      case "archived":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-600" />
                <Input
                  value={document.title}
                  onChange={(e) =>
                    setDocument((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Badge
                  variant="secondary"
                  className={getStatusColor(document.status)}
                >
                  {document.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2 mr-4">
                {collaborators.slice(0, 3).map((collaborator) => (
                  <Avatar
                    key={collaborator.id}
                    className="w-8 h-8 border-2 border-white"
                  >
                    <AvatarImage
                      src={collaborator.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xs">
                      {collaborator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {collaborators.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-slate-600">
                      +{collaborators.length - 3}
                    </span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCollaboratorPanelOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCommentPanelOpen(true)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-fit grid-cols-3 mb-6">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="preview-poet">Preview as Poet</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="bg-white">
              <TinyMCEEditor value={docText} onChange={setDocText} />
            </div>

            {/* Document Stats */}
            <div className="flex items-center justify-between text-sm text-slate-500 bg-white rounded-lg border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-6">
                <span>{document.wordCount.toLocaleString()} words</span>
                <span>{document.readingTime}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Last edited {document.lastEdited}</span>
                </div>
              </div>
              <span className="text-slate-400">Auto-saved</span>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: docText }}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview-poet">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
              <div
                className="prose prose-slate max-w-none font-serif"
                dangerouslySetInnerHTML={{ __html: docText }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Collaborator Panel */}
      <Sheet
        open={isCollaboratorPanelOpen}
        onOpenChange={setIsCollaboratorPanelOpen}
      >
        <SheetContent className="w-96">
          <CollaboratorPanel
            collaborators={collaborators}
            onAddCollaborator={(email) => {
              // Add collaborator logic
              toast.success("Collaborator invited", {
                description: `Invitation sent to ${email}`,
              })
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Comment Panel */}
      <Sheet open={isCommentPanelOpen} onOpenChange={setIsCommentPanelOpen}>
        <SheetContent className="w-96">
          <CommentPanel />
        </SheetContent>
      </Sheet>
    </div>
  )
}

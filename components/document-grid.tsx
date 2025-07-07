"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  StickyNote,
  PresentationIcon as PresentationChart,
  Users,
  BookOpen,
  Lightbulb,
  Edit3,
  Copy,
  MoreHorizontal,
  Share2,
  Archive,
  Clock,
} from "lucide-react"
import Link from "next/link"

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
  wordCount: number
  readingTime: string
  lastEdited: string
  status: "draft" | "published" | "archived" | "shared"
  author?: string
}

const documents: Document[] = [
  {
    id: "1",
    title: "Product Launch Strategy",
    type: "report",
    wordCount: 2847,
    readingTime: "12 min read",
    lastEdited: "2 hours ago",
    status: "draft",
    author: "You",
  },
  {
    id: "2",
    title: "Weekly Team Standup Notes",
    type: "meeting",
    wordCount: 456,
    readingTime: "2 min read",
    lastEdited: "1 day ago",
    status: "shared",
    author: "You",
  },
  {
    id: "3",
    title: "Getting Started with React Hooks",
    type: "article",
    wordCount: 1923,
    readingTime: "8 min read",
    lastEdited: "3 days ago",
    status: "published",
    author: "You",
  },
  {
    id: "4",
    title: "Q4 Performance Review",
    type: "presentation",
    wordCount: 1205,
    readingTime: "5 min read",
    lastEdited: "1 week ago",
    status: "draft",
    author: "You",
  },
  {
    id: "5",
    title: "Random Thoughts on Design",
    type: "note",
    wordCount: 234,
    readingTime: "1 min read",
    lastEdited: "2 weeks ago",
    status: "draft",
    author: "You",
  },
  {
    id: "6",
    title: "Mobile App Feature Ideas",
    type: "idea",
    wordCount: 678,
    readingTime: "3 min read",
    lastEdited: "3 weeks ago",
    status: "shared",
    author: "You",
  },
  {
    id: "7",
    title: "User Interview Insights",
    type: "report",
    wordCount: 3421,
    readingTime: "14 min read",
    lastEdited: "1 month ago",
    status: "published",
    author: "You",
  },
  {
    id: "8",
    title: "Blog Post Draft: AI in Design",
    type: "draft",
    wordCount: 892,
    readingTime: "4 min read",
    lastEdited: "1 month ago",
    status: "draft",
    author: "You",
  },
  {
    id: "9",
    title: "Company Culture Handbook",
    type: "article",
    wordCount: 4567,
    readingTime: "18 min read",
    lastEdited: "2 months ago",
    status: "archived",
    author: "You",
  },
]

const getDocumentIcon = (type: Document["type"]) => {
  const iconProps = { className: "w-8 h-8" }

  switch (type) {
    case "article":
      return <BookOpen {...iconProps} className="w-8 h-8 text-blue-500" />
    case "note":
      return <StickyNote {...iconProps} className="w-8 h-8 text-yellow-500" />
    case "report":
      return <FileText {...iconProps} className="w-8 h-8 text-green-500" />
    case "presentation":
      return (
        <PresentationChart {...iconProps} className="w-8 h-8 text-purple-500" />
      )
    case "meeting":
      return <Users {...iconProps} className="w-8 h-8 text-orange-500" />
    case "draft":
      return <Edit3 {...iconProps} className="w-8 h-8 text-slate-500" />
    case "idea":
      return <Lightbulb {...iconProps} className="w-8 h-8 text-amber-500" />
    default:
      return <FileText {...iconProps} className="w-8 h-8 text-slate-500" />
  }
}

const getStatusBadge = (status: Document["status"]) => {
  const variants = {
    draft: {
      label: "Draft",
      className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    },
    published: {
      label: "Published",
      className: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    shared: {
      label: "Shared",
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
    archived: {
      label: "Archived",
      className: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    },
  }

  const variant = variants[status]

  return (
    <Badge variant="secondary" className={variant.className}>
      {variant.label}
    </Badge>
  )
}

export default function DocumentGrid() {
  const handleEdit = (docId: string) => {
    console.log("Edit document:", docId)
    // Navigate to editor
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="group hover:shadow-md transition-all duration-200 cursor-pointer border-sidebar-accent hover:border-slate-300"
          onClick={() => handleEdit(doc.id)}
        >
          <Link href={`/document/${doc.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-shrink-0">{getDocumentIcon(doc.type)}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/document/${doc.id}`}>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">
                  {doc.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{doc.wordCount.toLocaleString()} words</span>
                  <span>{doc.readingTime}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Edited {doc.lastEdited}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {getStatusBadge(doc.status)}
                  <span className="text-xs text-slate-400 capitalize">
                    {doc.type}
                  </span>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}

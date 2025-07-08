"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  ExternalLink,
  Calendar,
  Link,
  Globe,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ContentDetailsProps {
  content: {
    id: string
    title: string
    createdAt: string
    contractAddress: string
    chain: string
    creator: string
    mediaType: string
    category: string
    wordCount: number
    readTime: string
  }
}

export default function ContentDetails({ content }: ContentDetailsProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!", {
      description: `${label} copied to clipboard`,
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Created</span>
          </div>
          <span className="text-sm text-slate-900 font-medium">
            {content.createdAt}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Contract address
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-900 font-mono">
              {formatAddress(content.contractAddress)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() =>
                copyToClipboard(content.contractAddress, "Contract address")
              }
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Chain</span>
          </div>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            {content.chain}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Creator</span>
          </div>
          <span className="text-sm text-slate-900 font-medium">
            @{content.creator}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Content Type
            </span>
          </div>
          <span className="text-sm text-slate-900 font-medium">
            {content.mediaType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Category</span>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {content.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">
              Word Count
            </span>
          </div>
          <span className="text-sm text-slate-900 font-medium">
            {content.wordCount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">
              Read Time
            </span>
          </div>
          <span className="text-sm text-slate-900 font-medium">
            {content.readTime}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Activity, FileText, Send } from "lucide-react"
import ContentDetails from "./content-details"
import TokenHolders from "./token-holders"
import TradingActivity from "./trading-activity"

interface ContentTabsProps {
  contentDetails: any
  holders: any[]
  activities: any[]
  totalHolders: number
}

export default function ContentTabs({
  contentDetails,
  holders,
  activities,
  totalHolders,
}: ContentTabsProps) {
  const [comment, setComment] = useState("")

  const handleAddComment = () => {
    if (comment.trim()) {
      // Handle comment submission
      console.log("Adding comment:", comment)
      setComment("")
    }
  }

  return (
    <Tabs defaultValue="comments" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
        <TabsTrigger value="comments" className="flex items-center gap-2">
          {/* <MessageSquare className="w-4 h-4" /> */}
          Comments
        </TabsTrigger>
        <TabsTrigger value="holders" className="flex items-center gap-2">
          {/* <Users className="w-4 h-4" /> */}
          Holders
          <span className="ml-1 text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">
            {0}
          </span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          {/* <Activity className="w-4 h-4" /> */}
          Activity
        </TabsTrigger>
        <TabsTrigger value="details" className="flex items-center gap-2">
          {/* <FileText className="w-4 h-4" /> */}
          Details
        </TabsTrigger>
      </TabsList>

      <TabsContent value="comments" className="mt-6">
        <div className="space-y-6">
          <div className="flex gap-3">
            <Input
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 bg-white/80 backdrop-blur-sm"
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button onClick={handleAddComment} disabled={!comment.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              No comments yet
            </h3>
            <p className="text-slate-500">Be the first to add a comment</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="holders" className="mt-6">
        <TokenHolders holders={[]} totalHolders={totalHolders} />
      </TabsContent>

      <TabsContent value="activity" className="mt-6">
        <TradingActivity activities={[]} />
      </TabsContent>

      <TabsContent value="details" className="mt-6">
        <ContentDetails content={contentDetails} />
      </TabsContent>
    </Tabs>
  )
}

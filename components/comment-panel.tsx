"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Play,
  Pause,
  Volume2,
  Reply,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
  }
  content?: string
  voiceNote?: {
    duration: string
    url: string
  }
  timestamp: string
  replies?: Comment[]
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: { name: "Sarah Wilson", avatar: "https://avatar.vercel.sh/sarah" },
    content:
      "Great start on the product launch strategy! I think we should add more details about the target market analysis.",
    timestamp: "2 hours ago",
    replies: [
      {
        id: "1-1",
        author: { name: "John Doe", avatar: "https://avatar.vercel.sh/john" },
        content: "Agreed! I'll work on that section this afternoon.",
        timestamp: "1 hour ago",
      },
    ],
  },
  {
    id: "2",
    author: { name: "Mike Johnson", avatar: "https://avatar.vercel.sh/mike" },
    voiceNote: {
      duration: "0:45",
      url: "#",
    },
    timestamp: "1 day ago",
  },
  {
    id: "3",
    author: { name: "Sarah Wilson", avatar: "https://avatar.vercel.sh/sarah" },
    content: "The competitive analysis section looks comprehensive. Nice work!",
    timestamp: "2 days ago",
  },
]

export default function CommentPanel() {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingVoiceNote, setPlayingVoiceNote] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: { name: "You", avatar: "https://avatar.vercel.sh/you" },
        content: newComment,
        timestamp: "Just now",
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      const reply: Comment = {
        id: `${commentId}-${Date.now()}`,
        author: { name: "You", avatar: "https://avatar.vercel.sh/you" },
        content: replyText,
        timestamp: "Just now",
      }

      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...(comment.replies || []), reply] }
            : comment
        )
      )
      setReplyText("")
      setReplyingTo(null)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording logic
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
      // Store interval ID to clear later
    } else {
      // Stop recording logic
      setRecordingTime(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const VoiceNotePlayer = ({
    voiceNote,
    commentId,
  }: {
    voiceNote: { duration: string; url: string }
    commentId: string
  }) => {
    const isPlaying = playingVoiceNote === commentId

    return (
      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setPlayingVoiceNote(isPlaying ? null : commentId)}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <div className="flex-1 h-2 bg-slate-200 rounded-full">
          <div className="h-full w-1/3 bg-blue-500 rounded-full" />
        </div>
        <span className="text-xs text-slate-500">{voiceNote.duration}</span>
        <Volume2 className="w-4 h-4 text-slate-400" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col px-4">
      <SheetHeader className="pb-4">
        <SheetTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments ({comments.length})
        </SheetTitle>
      </SheetHeader>

      {/* Add Comment Section */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e: any) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleRecording}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
              {isRecording && (
                <span className="ml-2">{formatTime(recordingTime)}</span>
              )}
            </Button>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                Recording...
              </Badge>
            )}
          </div>

          <Button
            onClick={handleAddComment}
            size="sm"
            disabled={!newComment.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1 pt-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage
                    src={comment.author.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-xs">
                    {comment.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-slate-900">
                        {comment.author.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {comment.timestamp}
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {comment.content && (
                    <p className="text-sm text-slate-700 mt-1">
                      {comment.content}
                    </p>
                  )}

                  {comment.voiceNote && (
                    <VoiceNotePlayer
                      voiceNote={comment.voiceNote}
                      commentId={comment.id}
                    />
                  )}

                  {/* Reply Section */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e: any) => setReplyText(e.target.value)}
                        className="min-h-[60px] resize-none text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                        >
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-slate-100">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <Avatar className="w-6 h-6 flex-shrink-0">
                            <AvatarImage
                              src={reply.author.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="text-xs">
                              {reply.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs text-slate-900">
                                {reply.author.name}
                              </span>
                              <span className="text-xs text-slate-500">
                                {reply.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 mt-1">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

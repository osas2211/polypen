"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { Editor } from "@tinymce/tinymce-react"
import { useEffect, useRef } from "react"
import { DefaultEventsMap, Socket } from "socket.io"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { io } from "socket.io-client"

const socket = io({ transports: ["websocket", "polling"] })

interface TinyMCEEditorProps {
  value: string
  onChange: (value: string) => void
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

export default function TinyMCEEditor({ value, onChange }: TinyMCEEditorProps) {
  const editorRef = useRef<Editor>(null)
  const isMobile = useIsMobile()
  const { id } = useParams()

  useEffect(() => {
    if (!socket) return

    // Listen for messages
    socket.on("edit_doc", (data) => {
      onChange(data)
    })

    socket.on("userJoined", ({ user, room }) => {
      // toast.success("User Joined", {
      //   description: `${user} joined ${room}`,
      // })
    })

    return () => {
      socket.off("message")
      socket.off("userJoined")
      socket.off("userLeft")
      socket.off("roomUsers")
      socket.off("error")
    }
  }, [socket, toast])

  useEffect(() => {
    if (!socket) return
    socket.emit("joinRoom", { room: "1" })
    return () => {
      socket.off("joinRoom")
    }
  }, [socket])

  return (
    <div className="min-h-[600px]">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
        ref={editorRef}
        init={{
          placeholder: "write text here..",
          height: isMobile ? 500 : 750,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
        }}
        tagName="content"
        onEditorChange={(text) => {
          socket.emit("edit_doc", { doc_id: "1", text: text })
          onChange(text)
        }}
        value={value}
      />
    </div>
  )
}

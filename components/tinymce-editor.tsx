"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { Editor } from "@tinymce/tinymce-react"
import { useEffect, useRef } from "react"

interface TinyMCEEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function TinyMCEEditor({ value, onChange }: TinyMCEEditorProps) {
  const editorRef = useRef<Editor>(null)
  const isMobile = useIsMobile()

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
        onEditorChange={(value) => onChange(value)}
        value={value}
      />
    </div>
  )
}

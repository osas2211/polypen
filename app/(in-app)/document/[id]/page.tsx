"use client"
import React, { useState } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const DocumentPage = () => {
  const [docText, setDocText] = useState("")
  const [title, setTitle] = useState("")
  const isMobile = useIsMobile()
  return (
    <div className="space-y-4">
      <Tabs defaultValue="editor">
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="preview-poet">Preview as Poet</TabsTrigger>
          </TabsList>
          <Button className="h-[40px] cursor-pointer" variant={"secondary"}>
            + Add collaborator
          </Button>
        </div>
        <TabsContent value="editor">
          <div className="space-y-7">
            <div className="">
              <input
                className="text-lg md:text-5xl placeholder-gray-500 border-none outline-none"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
            </div>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
              init={{
                placeholder: "write text here..",
                height: isMobile ? 500 : 750,
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
              }}
              tagName="biography"
              onEditorChange={(value) => setDocText(value)}
              value={docText}
            />
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="space-y-7">
            <p className="text-lg md:text-5xl placeholder-gray-500 border-none outline-none">
              {title}
            </p>
            <div
              className=""
              dangerouslySetInnerHTML={{ __html: docText }}
            ></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DocumentPage

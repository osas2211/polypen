"use client"
import DocumentEditor from "@/components/document-editor"
import { useParams } from "next/navigation"

export default function EditorPage() {
  const { id } = useParams()
  return <DocumentEditor documentId={id as string} />
}

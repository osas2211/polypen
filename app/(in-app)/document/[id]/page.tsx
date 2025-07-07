import DocumentEditor from "@/components/document-editor"

interface PageProps {
  params: {
    id: string
  }
}

export default function EditorPage({ params }: PageProps) {
  return <DocumentEditor documentId={params.id} />
}

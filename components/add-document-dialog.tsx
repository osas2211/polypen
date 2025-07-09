"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  FileText,
  StickyNote,
  PresentationIcon as PresentationChart,
  Users,
  BookOpen,
  Lightbulb,
  Edit3,
  Plus,
} from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/walletContext"
import { useCreateDocument } from "@/hooks/use-documents"
import { useCreateCoin } from "@/hooks/useZora"
import { createMetadataUri, DocumentMetadata } from "@/utils/metadata"
import { useCreateCoinForDocument } from "@/hooks/useCreateCoin"

const documentTypes = [
  { value: "article", label: "Article", icon: BookOpen },
  { value: "note", label: "Note", icon: StickyNote },
  { value: "report", label: "Report", icon: FileText },
  { value: "presentation", label: "Presentation", icon: PresentationChart },
  { value: "meeting", label: "Meeting Notes", icon: Users },
  { value: "draft", label: "Draft", icon: Edit3 },
  { value: "idea", label: "Idea", icon: Lightbulb },
] as const

const documentStatuses = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "shared", label: "Shared" },
  { value: "archived", label: "Archived" },
] as const

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be less than 100 characters" }),
  tokenSymbol: z
    .string()
    .min(1, { message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be less than 100 characters" }),
  type: z.enum(
    ["article", "note", "report", "presentation", "meeting", "draft", "idea"],
    {
      required_error: "Please select a document type",
    }
  ),
  status: z.enum(["draft", "published", "shared", "archived"], {
    required_error: "Please select a status",
  }),
})

type FormData = z.infer<typeof formSchema>

interface AddDocumentDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onDocumentCreated?: (
    document: FormData & { id: string; createdAt: Date }
  ) => void
}

async function getMetadataUri(meta: object): Promise<string> {
  const res = await fetch("/api/ipfs-pinata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meta),
  })
  const { uri, error } = await res.json()
  if (error) throw new Error(error)
  return uri
}

export default function AddDocumentDialog({
  open,
  setOpen,
  onDocumentCreated,
}: AddDocumentDialogProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "article",
      status: "draft",
      tokenSymbol: "",
    },
  })

  const { address, signer, connectWallet } = useWallet()
  const { mutateAsync, isPending } = useCreateDocument()
  const mutation = useCreateCoinForDocument()
  const { mutateAsync: createCoin } = useCreateCoin()

  const onSubmit = async (data: FormData) => {
    try {
      const id = Date.now().toString()
      const meta: DocumentMetadata = {
        name: data.title,
        description: data.title,
        author: address!,
        createdAt: Date.now().toLocaleString(),
        tags: ["blockchain", "zora", "editor"],
        image:
          "https://magic.decentralized-content.com/ipfs/bafybeiclpeiscryptz7f6h3gztz6cptkamgxaf4bbhzzoo2juof5nj57ii",
      }
      const payload = {
        id,
        title: data.title,
        content: "",
        category: data.type,
        readTime: "5 min",
        views: "20k",
        tokenSymbol: data.tokenSymbol,
        featured: false,
        gradient: "blue-to-green",
        tags: ["blockchain", "zora", "editor"],
        author_wallet: address?.toLowerCase(),
        status: data.status,
      }
      const uri = await getMetadataUri(meta)
      await mutateAsync(payload)

      const handleMint = async () => {
        if (!signer) {
          await connectWallet()
          return
        }
        mutation.mutate({
          name: data.title,
          symbol: data.tokenSymbol,
          uri: uri,
          payoutAddr: address!,
        })
      }
      await handleMint()

      toast.success("Document created", {
        description: `"${data.title}" has been created successfully.`,
      })

      // Reset form and close dialog
      form.reset()
      setOpen(false)
      router.push(`/document/${id}`)
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.message || "Failed to create document. Please try again.",
      })
    }
  }

  const handleClose = () => {
    form.reset()
    setOpen(false)
  }

  const getTypeIcon = (type: string) => {
    const documentType = documentTypes.find((t) => t.value === type)
    if (!documentType) return <FileText className="w-4 h-4" />
    const Icon = documentType.icon
    return <Icon className="w-4 h-4" />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Document
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tokenSymbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g ETH,ZORA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          {field.value && getTypeIcon(field.value)}
                          <SelectValue placeholder="Select document type" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {/* <Icon className="w-4 h-4" /> */}
                              {type.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Creating..."
                  : "Create Document"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

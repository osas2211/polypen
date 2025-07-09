import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useWallet } from "@/contexts/walletContext"
import {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  inviteCollaborator,
  DocumentMeta,
  Collaborator,
} from "@/services/documentsService"

/** List all documents */
export function useDocuments() {
  return useQuery<DocumentMeta[]>({
    queryKey: ["documents"],
    queryFn: listDocuments,
    // staleTime: 1000 * 60, // 1 minute
  })
}

/** Get a single document by ID */
export function useDocument(id: string | undefined) {
  return useQuery<DocumentMeta | null>({
    queryKey: ["document", id],
    queryFn: () => getDocument(id!),
    enabled: Boolean(id),
  })
}

/** Create a new document */
export function useCreateDocument() {
  const { signer, address } = useWallet()
  const qc = useQueryClient()

  return useMutation<
    void,
    Error,
    Omit<
      DocumentMeta,
      "createdAt" | "publishedAt" | "author" | "collaborators"
    > & { author_wallet?: string }
  >({
    mutationFn: (payload) =>
      createDocument(
        {
          ...payload,
          author_wallet: address!,
        },
        signer!
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] })
    },
  })
}

/** Update an existing document */
export function useUpdateDocument(id: string) {
  const { signer } = useWallet()
  const qc = useQueryClient()

  return useMutation<
    void,
    Error,
    Partial<Omit<DocumentMeta, "id" | "author" | "publishedAt" | "createdAt">>
  >({
    mutationFn: (updates) => updateDocument(id, updates, signer!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] })
      qc.invalidateQueries({ queryKey: ["document", id] })
    },
  })
}

/** Delete a document */
export function useDeleteDocument() {
  const { signer } = useWallet()
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteDocument(id, signer!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] })
    },
  })
}

/** Invite a collaborator to a document */
export function useInviteCollaborator(id: string) {
  const { signer } = useWallet()
  const qc = useQueryClient()

  return useMutation<void, Error, Collaborator>({
    mutationFn: (collab) => inviteCollaborator(id, collab, signer!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["document", id] })
    },
  })
}

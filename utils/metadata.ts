import { NFTStorage, File } from "nft.storage"

export interface DocumentMetadata {
  name: string // e.g. document title
  description: string // short summary or excerpt
  contentUri?: string // optional: IPFS URI to the full body, if you split out content
  imageUri?: string // optional: cover image or banner (ipfs://…)
  author: string // wallet address or human name
  createdAt: string // ISO timestamp
  tags: string[] // e.g. ["blockchain","tutorial"]
  [key: string]: any // allow extra props
}

/**
 * Uploads a JSON blob to IPFS via nft.storage and returns the ipfs:// URI.
 * Requires you set NFT_STORAGE_API_KEY in your env.
 */
export async function createMetadataUri(
  meta: DocumentMetadata
): Promise<string> {
  const token = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
  if (!token) {
    throw new Error("Missing NEXT_PUBLIC_NFT_STORAGE_API_KEY in env")
  }

  // Instantiate the client
  const client = new NFTStorage({ token })

  // Serialize & wrap as a File
  const json = JSON.stringify(meta, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  const file = new File([blob], "metadata.json")

  // Store and get a CID back
  const cid = await client.storeBlob(file)
  // Return the URI for use in createCoinForDocument({ uri: metadataUri, … })
  return `ipfs://${cid}`
}

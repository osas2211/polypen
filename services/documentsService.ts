// src/services/documentService.ts
import { Database } from "@tableland/sdk"
import { Signer } from "ethers"

const DOC_TABLE = process.env.NEXT_PUBLIC_DOCUMENTS_TABLE!

export interface Collaborator {
  name: string
  avatar: string
  wallet_address: string
}

export interface DocumentMeta {
  id: string
  title: string
  content: string
  category: string
  publishedAt: string
  readTime: string
  views: string
  tokenSymbol: string
  createdAt: string
  author: { wallet_address: string }
  collaborators: Collaborator[]
  featured: boolean
  gradient: string
  tags: string[]
}

/** CREATE */
export async function createDocument(
  input: Omit<
    DocumentMeta,
    "createdAt" | "publishedAt" | "author" | "collaborators"
  > & {
    author_wallet: string
  },
  signer: Signer
) {
  if (!signer) throw new Error("Signer required")
  const db = new Database({ signer })
  const now = new Date().toISOString()

  await db
    .prepare(
      `INSERT INTO ${DOC_TABLE}
        (id,title,content,category,publishedAt,readTime,views,tokenSymbol,createdAt,author_wallet,collaborators,featured,gradient,tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    )
    .bind(
      input.id,
      input.title,
      input.content,
      input.category,
      now,
      input.readTime,
      input.views,
      input.tokenSymbol,
      now,
      input.author_wallet,
      JSON.stringify([]), // no collaborators initially
      input.featured ? 1 : 0,
      input.gradient,
      JSON.stringify(input.tags)
    )
    .run()
    .then((r) => r.meta.txn?.wait())
}

/** READ ALL */
export async function listDocuments(): Promise<DocumentMeta[]> {
  const db = new Database() // read-only
  const { results } = await db.prepare(`SELECT * FROM ${DOC_TABLE};`).all()

  return results.map((r: any) => ({
    id: r.id,
    title: r.title,
    content: r.content,
    category: r.category,
    publishedAt: r.publishedAt,
    readTime: r.readTime,
    views: r.views,
    tokenSymbol: r.tokenSymbol,
    createdAt: r.createdAt,
    author: { wallet_address: r.author_wallet },
    collaborators: JSON.parse(r.collaborators),
    featured: Boolean(r.featured),
    gradient: r.gradient,
    tags: JSON.parse(r.tags),
  }))
}

/** READ ONE */
export async function getDocument(id: string): Promise<DocumentMeta | null> {
  const db = new Database()
  const { results } = await db
    .prepare(`SELECT * FROM ${DOC_TABLE} WHERE id = ? LIMIT 1;`)
    .bind(id)
    .all()

  if (!results.length) return null
  const r = results[0]
  return {
    id: r.id as any,
    title: r.title as any,
    content: r.content as any,
    category: r.category as any,
    publishedAt: r.publishedAt as any,
    readTime: r.readTime as any,
    views: r.views as any,
    tokenSymbol: r.tokenSymbol as any,
    createdAt: r.createdAt as any,
    author: { wallet_address: r.author_wallet as any },
    collaborators: JSON.parse(r.collaborators as any),
    featured: Boolean(r.featured),
    gradient: r.gradient as any,
    tags: JSON.parse(r.tags as any),
  }
}

/** UPDATE (author only) */
export async function updateDocument(
  id: string,
  updates: Partial<
    Omit<DocumentMeta, "id" | "author" | "publishedAt" | "createdAt">
  >,
  signer: Signer
) {
  if (!signer) throw new Error("Signer required")
  const db = new Database({ signer })
  const user = await signer.getAddress()

  // fetch author
  const raw = await db
    .prepare(
      `SELECT author_wallet, collaborators FROM ${DOC_TABLE} WHERE id = ?;`
    )
    .bind(id)
    .all()

  if (!raw.results.length || raw.results[0].author_wallet !== user) {
    throw new Error("Not authorized")
  }

  const sets: string[] = []
  const vals: any[] = []

  for (const [k, v] of Object.entries(updates)) {
    if (k === "collaborators" || k === "tags") {
      sets.push(`${k} = ?`)
      vals.push(JSON.stringify(v))
    } else if (k === "featured") {
      sets.push(`featured = ?`)
      vals.push(v ? 1 : 0)
    } else {
      sets.push(`${k} = ?`)
      vals.push(v)
    }
  }
  if (!sets.length) return

  await db
    .prepare(`UPDATE ${DOC_TABLE} SET ${sets.join(", ")} WHERE id = ?;`)
    .bind(...vals, id)
    .run()
    .then((r) => r.meta.txn?.wait())
}

/** DELETE (author only) */
export async function deleteDocument(id: string, signer: Signer) {
  if (!signer) throw new Error("Signer required")
  const db = new Database({ signer })
  const user = await signer.getAddress()

  const raw = await db
    .prepare(`SELECT author_wallet FROM ${DOC_TABLE} WHERE id = ?;`)
    .bind(id)
    .all()

  if (!raw.results.length || raw.results[0].author_wallet !== user) {
    throw new Error("Not authorized")
  }

  await db
    .prepare(`DELETE FROM ${DOC_TABLE} WHERE id = ?;`)
    .bind(id)
    .run()
    .then((r) => r.meta.txn?.wait())
}

/** INVITE (author only) */
export async function inviteCollaborator(
  id: string,
  collaborator: Collaborator,
  signer: Signer
) {
  if (!signer) throw new Error("Signer required")
  const db = new Database({ signer })
  const user = await signer.getAddress()

  const raw = await db
    .prepare(
      `SELECT author_wallet, collaborators FROM ${DOC_TABLE} WHERE id = ?;`
    )
    .bind(id)
    .all()

  if (!raw.results.length || raw.results[0].author_wallet !== user) {
    throw new Error("Not authorized")
  }

  const collabs = JSON.parse(
    raw.results[0].collaborators as any
  ) as Collaborator[]
  collabs.push(collaborator)

  await db
    .prepare(`UPDATE ${DOC_TABLE} SET collaborators = ? WHERE id = ?;`)
    .bind(JSON.stringify(collabs), id)
    .run()
    .then((r) => r.meta.txn?.wait())
}

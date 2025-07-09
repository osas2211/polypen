// src/services/tablelandService.ts

import { Database } from "@tableland/sdk"
import { BrowserProvider, Wallet, JsonRpcProvider, Signer } from "ethers"

let db: Database | null = null

/**
 * Returns a singleton Database, using:
 * 1) the passed-in signer (if any),
 * 2) the injected window.ethereum signer on client,
 * 3) a service wallet on server via PRIVATE_KEY + RPC_URL.
 */
async function getDB(signer?: Signer): Promise<Database> {
  if (db) return db

  if (signer) {
    db = new Database({ signer })
  } else if (typeof window !== "undefined") {
    const eth = (window as any).ethereum
    if (!eth) throw new Error("No injected Ethereum provider")
    const provider = new BrowserProvider(eth)
    await provider.send("eth_requestAccounts", [])
    const userSigner = await provider.getSigner()
    db = new Database({ signer: userSigner })
  } else {
    const pk = process.env.PRIVATE_KEY
    const rpc = process.env.RPC_URL
    if (!pk || !rpc) {
      throw new Error("Missing PRIVATE_KEY or RPC_URL in server env")
    }
    const provider = new JsonRpcProvider(rpc)
    const wallet = new Wallet(pk, provider)
    db = new Database({ signer: wallet })
  }

  return db
}

const TABLE = process.env.TABLELAND_TABLE!

export interface UserProfileInput {
  wallet_address: string
  name: string
  role: string
  bio?: string
  website?: string
  avatar?: string
  language?: string
}

/**
 * Onboard a user — INSERT into Tableland.
 * Pass a Signer if you want to control which wallet signs the tx.
 */
export async function onboardUserTableland(
  profile: UserProfileInput,
  signer?: Signer
) {
  const conn = await getDB(signer)
  const now = new Date().toISOString()

  const { meta } = await conn
    .prepare(
      `INSERT INTO ${TABLE}
         (wallet_address, name, role, bio, website, avatar, language, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
    )
    .bind(
      profile.wallet_address,
      profile.name,
      profile.role,
      profile.bio ?? "",
      profile.website ?? "",
      profile.avatar ?? "",
      profile.language ?? "en",
      now
    )
    .run()

  await meta.txn?.wait()
  return meta
}

/** Fetch all users */
export async function fetchAllUsersTableland() {
  const conn = await getDB()
  const { results } = await conn.prepare(`SELECT * FROM ${TABLE};`).all()
  return results.map((r: any) => ({
    wallet_address: r.wallet_address,
    name: r.name,
    role: r.role,
    bio: r.bio,
    website: r.website,
    avatar: r.avatar,
    language: r.language,
    createdAt: r.createdAt,
  }))
}

/** Fetch a single user by wallet_address */
export async function fetchUserByWalletTableland(wallet: string) {
  const conn = await getDB()
  const { results } = await conn
    .prepare(
      `SELECT * FROM ${TABLE}
         WHERE wallet_address = ?
         LIMIT 1;`
    )
    .bind(wallet)
    .all()

  if (results.length === 0) return null
  const r = results[0]
  return {
    wallet_address: r.wallet_address,
    name: r.name,
    role: r.role,
    bio: r.bio,
    website: r.website,
    avatar: r.avatar,
    language: r.language,
    createdAt: r.createdAt,
  }
}

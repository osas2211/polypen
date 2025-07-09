import { Database } from "@tableland/sdk"
import { BrowserProvider } from "ethers"

let db: Database | null = null
async function getDB(): Promise<Database> {
  if (db) return db

  if (typeof window !== "undefined") {
    // client: no chain/network needed
    const eth = (window as any).ethereum
    if (!eth) throw new Error("No injected Ethereum provider")
    const provider = new BrowserProvider(eth)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    db = new Database({ signer })
  } else {
    // server: read-only
    db = new Database()
  }

  return db
}

const TABLE = process.env.TABLELAND_TABLE!

export async function onboardUserTableland(profile: {
  wallet_address: string
  name: string
  role: string
  bio?: string
  website?: string
  avatar?: string
}) {
  const db = await getDB()
  const now = new Date().toISOString()

  const { meta } = await db
    .prepare(
      `INSERT INTO ${TABLE}
       (wallet_address, name, role, bio, website, avatar, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?);`
    )
    .bind(
      profile.wallet_address,
      profile.name,
      profile.role,
      profile.bio ?? "",
      profile.website ?? "",
      profile.avatar ?? "",
      now
    )
    .run()

  await meta?.txn?.wait()
  return meta
}

export async function fetchAllUsersTableland() {
  const db = await getDB()
  const { results } = await db.prepare(`SELECT * FROM ${TABLE};`).all()
  return results.map((r: any) => ({
    wallet_address: r.wallet_address,
    name: r.name,
    role: r.role,
    bio: r.bio,
    website: r.website,
    avatar: r.avatar,
    createdAt: r.createdAt,
  }))
}

export async function fetchUserByWalletTableland(wallet: string) {
  const db = await getDB()
  const { results } = await db
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
    createdAt: r.createdAt,
  }
}

// scripts/create-documents-tableland.js
require("dotenv").config()
const { Database } = require("@tableland/sdk")
const { Wallet, JsonRpcProvider } = require("ethers")

async function main() {
  const pk = process.env.PRIVATE_KEY
  const rpcUrl = process.env.RPC_URL
  if (!pk || !rpcUrl) {
    console.error("⚠️  Missing PRIVATE_KEY or RPC_URL")
    process.exit(1)
  }

  const provider = new JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(pk, provider)
  const db = new Database({ signer: wallet })

  const stmt = `
    CREATE TABLE documents (
      id            TEXT PRIMARY KEY,
      title         TEXT,
      content       TEXT,
      category      TEXT,
      publishedAt   TEXT,
      readTime      TEXT,
      views         TEXT,
      tokenSymbol   TEXT,
      createdAt     TEXT,
      author_wallet TEXT,
      collaborators TEXT,
      featured      INTEGER,
      gradient      TEXT,
      tags          TEXT,
      status        TEXT
    );
  `
  const { meta } = await db.prepare(stmt).run()
  await meta.txn.wait()

  console.log("✅ Created documents table:", meta.txn.name)
  console.log("\nCopy into .env.local:")
  console.log(`  DOCUMENTS_TABLE=${meta.txn.name}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

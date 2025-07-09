// scripts/create-tableland.js
require("dotenv").config()
const { Database } = require("@tableland/sdk")
const { Wallet, JsonRpcProvider } = require("ethers")

async function main() {
  const pk = process.env.PRIVATE_KEY
  const rpcUrl = process.env.RPC_URL
  if (!pk || !rpcUrl) {
    console.error("⚠️  Missing PRIVATE_KEY or RPC_URL in .env.local")
    process.exit(1)
  }

  // 1) Connect your wallet to Sepolia (or whichever RPC_URL you set)
  const provider = new JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(pk, provider)

  // 2) Initialize Tableland with that signer
  const db = new Database({ signer: wallet })

  // 3) CREATE TABLE; run() returns { meta, results? }
  const createStmt = `
    CREATE TABLE user_profiles (
      wallet_address TEXT PRIMARY KEY,
      name           TEXT,
      role           TEXT,
      bio            TEXT,
      website        TEXT,
      avatar         TEXT,
      createdAt      TEXT
    );
  `
  const { meta } = await db.prepare(createStmt).run()

  // 4) The table name is in meta.txn.name
  const tableName = meta.txn.name
  console.log("✅ Created table:", tableName)
  console.log("\n👉 Copy this into your .env.local as:")
  console.log(`   TABLELAND_TABLE=${tableName}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

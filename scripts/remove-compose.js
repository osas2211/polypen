// scripts/remove-compose.js
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// 1) Uninstall ComposeDB-related dependencies
console.log("❎ Uninstalling ComposeDB packages...")
try {
  execSync(
    "npm uninstall @composedb/client @ceramicnetwork/http-client did-session @didtools/pkh-ethereum",
    { stdio: "inherit" }
  )
} catch (e) {
  console.warn("⚠️  npm uninstall failed (maybe already removed)")
}

// 2) Delete ComposeDB files
const toDelete = [
  "src/services/compose.ts",
  "src/services/definitions.json",
  "src/services/composite.json",
  "scripts/composite-create.js",
  "scripts/composite-compile.js",
]
console.log("🗑️  Deleting ComposeDB files...")
toDelete.forEach((rel) => {
  const p = path.resolve(process.cwd(), rel)
  if (fs.existsSync(p)) {
    fs.unlinkSync(p)
    console.log(`  • Deleted ${rel}`)
  }
})

// 3) Remove ENV entries
const envFile = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envFile)) {
  console.log("✂️  Stripping ComposeDB vars from .env.local...")
  const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/)
  const filtered = lines.filter(
    (l) =>
      !/^(CERAMIC_API_URL|USER_REGISTRY_STREAM_ID|COMPOSE_DID_PRIVATE_KEY)=/.test(
        l
      )
  )
  fs.writeFileSync(envFile, filtered.join("\n"))
  console.log("  • Updated .env.local")
} else {
  console.warn("⚠️  .env.local not found, skipping env cleanup")
}

console.log("✅ ComposeDB cleanup complete!")

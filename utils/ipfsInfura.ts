// src/utils/ipfsInfura.ts

import FormData from "form-data"
import fetch from "node-fetch" // Next.js Server runtime provides global fetch; if not, install node-fetch

// Pull your Infura IPFS credentials from env
const projectId = process.env.INFURA_IPFS_PROJECT_ID!
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET!
if (!projectId || !projectSecret) {
  throw new Error(
    "Missing INFURA_IPFS_PROJECT_ID or INFURA_IPFS_PROJECT_SECRET in env"
  )
}

// Build Basic auth header
const auth =
  "Basic " +
  Buffer.from(`${projectId}:${projectSecret}`, "utf-8").toString("base64")

/**
 * Pins a JSON object to IPFS via Infura and returns an `ipfs://<CID>` URI.
 */
export async function uploadJSONToIPFS(json: object): Promise<string> {
  // 1) Prepare multipart form-data
  const form = new FormData()
  form.append("file", Buffer.from(JSON.stringify(json)), {
    filename: "metadata.json",
    contentType: "application/json",
  })

  // 2) POST to Infura IPFS endpoint
  const res = await fetch(
    "https://ipfs.infura.io:5001/api/v0/pin/add?arg=QmfQ5QAjvg4GtA3wg3adpnDJug8ktA1BxurVqBD8rtgVjM",
    {
      method: "POST",
      headers: {
        Authorization: auth,
        ...form.getHeaders(), // set multipart/form-data boundary
      },
      body: form as any, // node-fetch accepts form-data body
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`IPFS upload failed: ${res.status} ${text}`)
  }

  // 3) Parse the JSON response
  // Infura returns e.g. { "Name":"metadata.json","Hash":"Qm...","Size":"..."}
  const { Hash } = (await res.json()) as {
    Name: string
    Hash: string
    Size: string
  }
  return `ipfs://${Hash}`
}

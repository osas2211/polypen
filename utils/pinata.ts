// src/utils/pinata.ts

import pinataSdk from "@pinata/sdk"

const key = process.env.PINATA_API_KEY!
const secret = process.env.PINATA_API_SECRET!

if (!key || !secret) {
  throw new Error("Missing PINATA_API_KEY or PINATA_API_SECRET in environment")
}

// Initialize the Pinata client
const pinata = new pinataSdk(key, secret)

/**
 * Pin an arbitrary JSON object to IPFS via Pinata.
 * @param obj Any JSON‐serializable object (e.g. your metadata)
 * @returns A URI of the form ipfs://<CID>
 */
export async function pinJSONToIPFS(obj: object): Promise<string> {
  // pinJSONToIPFS returns { IpfsHash, PinSize, Timestamp }
  const result = await pinata.pinJSONToIPFS(obj)
  return `ipfs://${result.IpfsHash}`
}

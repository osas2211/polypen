// src/services/zoraService.ts

import {
  setApiKey,
  createCoin,
  getCoin,
  getProfileBalances,
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  InitialPurchaseCurrency,
} from "@zoralabs/coins-sdk"
import { createPublicClient, createWalletClient, http } from "viem"
import { baseSepolia } from "viem/chains" // ← Base Sepolia
import type { Signer } from "ethers"

// ── CONFIG ───────────────────────────────────────────────────
const API_KEY = process.env.NEXT_PUBLIC_ZORA_API_KEY!
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!
if (!API_KEY || !RPC_URL) {
  throw new Error("Missing NEXT_PUBLIC_ZORA_API_KEY or NEXT_PUBLIC_RPC_URL")
}

setApiKey(API_KEY)

export const publicClient = createPublicClient({
  chain: baseSepolia, // ← use Base Sepolia here
  transport: http(RPC_URL),
})

/**
 * Build a Viem WalletClient from an ethers Signer.
 */
export async function getWalletClient(signer: Signer) {
  const address = (await signer.getAddress()) as `0x${string}`
  return createWalletClient({
    chain: baseSepolia, // ← and here
    transport: http(RPC_URL),
    account: address,
  })
}

// ── COIN YOUR DOCUMENT ───────────────────────────────────────

export async function createCoinForDocument(
  args: {
    name: string
    symbol: string
    uri: string
    payoutAddr: string
    platformReferrer?: string
    initialPurchase?: {
      currency: "ETH"
      amountWei: bigint
    }
  },
  signer: Signer
) {
  const walletClient = await getWalletClient(signer)

  const result = await createCoin(
    {
      name: args.name,
      symbol: args.symbol,
      uri: args.uri as any,
      payoutRecipient: args.payoutAddr as any,
      platformReferrer: args.platformReferrer as any,
      chainId: baseSepolia.id, // ← and here
      initialPurchase: args.initialPurchase
        ? {
            currency: InitialPurchaseCurrency.ETH,
            amount: args.initialPurchase.amountWei,
          }
        : undefined,
    },
    walletClient,
    publicClient,
    { gasMultiplier: 1.2 }
  )

  return {
    txHash: result.hash,
    coinAddress: result.address,
  }
}

// ── QUERY COIN DETAILS ────────────────────────────────────────

export async function fetchCoinDetails(coinAddress: string) {
  const resp = await getCoin({
    address: coinAddress,
    chain: baseSepolia.id, // ← and here if you ever pass chain manually
  })
  return resp.data?.zora20Token
}

// ── GET HOLDERS ──────────────────────────────────────────────

export async function fetchCoinHolders(coinAddress: string) {
  const resp = await getProfileBalances({
    identifier: coinAddress,
    count: 50,
    after: undefined,
    // chain: baseSepolia, // ← some SDK calls also accept chain override
  })
  return resp.data?.profile?.coinBalances?.edges.map((e: any) => e.node) ?? []
}

// ── ANALYTICS ────────────────────────────────────────────────

export async function fetchTopGainers(count = 10) {
  const resp = await getCoinsTopGainers({
    count,
    after: undefined,
    // chain: baseSepolia.id,
  })
  return resp.data?.exploreList?.edges.map((e: any) => e.node) ?? []
}

export async function fetchTopVolume(count = 10) {
  const resp = await getCoinsTopVolume24h({
    count,
    after: undefined,
    // chain: baseSepolia.id,
  })
  return resp.data?.exploreList?.edges.map((e: any) => e.node) ?? []
}

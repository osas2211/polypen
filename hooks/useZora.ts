// src/hooks/useZora.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useWallet } from "@/contexts/walletContext"
import {
  createCoinForDocument,
  fetchCoinDetails,
  fetchCoinHolders,
  fetchTopGainers,
  fetchTopVolume,
} from "@/services/zoraServices"

type CreateCoinArgs = Parameters<typeof createCoinForDocument>[0]
type CreateCoinResult = Awaited<ReturnType<typeof createCoinForDocument>>

/** Fetch top gainers on Zora */
export function useTopGainers(count: number = 10) {
  return useQuery<any[]>({
    queryKey: ["zora", "top-gainers", count],
    queryFn: () => fetchTopGainers(count),
    staleTime: 1000 * 60,
  })
}

/** Fetch top volume coins (24h) */
export function useTopVolume(count: number = 10) {
  return useQuery<any[]>({
    queryKey: ["zora", "top-volume", count],
    queryFn: () => fetchTopVolume(count),
    staleTime: 1000 * 60,
  })
}

/** Fetch detailed info for a single coin by address */
export function useCoinDetails(coinAddress: string | undefined) {
  return useQuery<any>({
    queryKey: ["zora", "coin-details", coinAddress],
    queryFn: () => fetchCoinDetails(coinAddress!),
    enabled: Boolean(coinAddress),
  })
}

/** Fetch current holders of a coin */
export function useCoinHolders(coinAddress: string | undefined) {
  return useQuery<any[]>({
    queryKey: ["zora", "coin-holders", coinAddress],
    queryFn: () => fetchCoinHolders(coinAddress!),
    enabled: Boolean(coinAddress),
    staleTime: 1000 * 30,
  })
}

/** Mint a new coin for a document */
export function useCreateCoin() {
  const { signer, address } = useWallet()
  const qc = useQueryClient()

  return useMutation<CreateCoinResult, Error, CreateCoinArgs>({
    mutationFn: (args) =>
      createCoinForDocument(
        {
          ...args,
          payoutAddr: address!, // ensure document author is payout recipient
        },
        signer!
      ),
    onSuccess: () => {
      // You might want to refresh a list of coins or details
      qc.invalidateQueries({ queryKey: ["zora", "coin-details"] })
    },
  })
}

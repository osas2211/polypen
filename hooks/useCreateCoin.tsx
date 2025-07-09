// src/hooks/useCreateCoin.tsx
"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useWallet } from "@/contexts/walletContext"
import { createCoinForDocument } from "@/services/zoraServices"

type CreateCoinArgs = Parameters<typeof createCoinForDocument>[0]
type CreateCoinResult = Awaited<ReturnType<typeof createCoinForDocument>>

export function useCreateCoinForDocument() {
  const { signer, address } = useWallet()
  const qc = useQueryClient()

  return useMutation<CreateCoinResult, Error, CreateCoinArgs>({
    mutationFn: (args) => {
      if (!signer) throw new Error("Wallet not connected")
      return createCoinForDocument({ ...args, payoutAddr: address! }, signer)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["zora", "coin-details"] })
    },
  })
}

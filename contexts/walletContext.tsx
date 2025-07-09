// src/contexts/WalletContext.tsx
"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { BrowserProvider, Signer } from "ethers"

interface WalletContextType {
  address?: string
  signer?: Signer
  connectWallet: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  connectWallet: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string>()
  const [signer, setSigner] = useState<Signer>()

  // Optionally: on mount, check if already connected
  useEffect(() => {
    if (typeof window === "undefined") return
    const eth = (window as any).ethereum
    if (!eth) return
    eth
      .request({ method: "eth_accounts" })
      .then(async (accounts: string[]) => {
        if (accounts[0]) {
          const provider = new BrowserProvider(eth)
          const sg = await provider.getSigner()
          setSigner(sg)
          setAddress(accounts[0])
        }
      })
      .catch(() => {})
  }, [])

  const connectWallet = async () => {
    const eth = (window as any).ethereum
    if (!eth) {
      alert("Please install MetaMask or another Ethereum wallet.")
      return
    }
    const provider = new BrowserProvider(eth)
    await provider.send("eth_requestAccounts", [])
    const sg = await provider.getSigner()
    const addr = await sg.getAddress()
    setSigner(sg)
    setAddress(addr)
  }

  const disconnect = () => {
    setSigner(undefined)
    setAddress(undefined)
  }

  return (
    <WalletContext.Provider
      value={{ address, signer, connectWallet, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}

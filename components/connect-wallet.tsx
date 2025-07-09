"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/walletContext"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Wallet,
  Copy,
  ExternalLink,
  LogOut,
  CheckCircle,
  Zap,
  ChevronDown,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ConnectWalletButton() {
  const { address, connectWallet, disconnect } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
      toast.success("Wallet Connected", {
        description: "Successfully connected to your wallet",
      })
    } catch (error) {
      toast.error("Connection Failed", {
        description: "Failed to connect wallet. Please try again.",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success("Wallet Disconnected", {
      description: "Your wallet has been disconnected",
    })
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address Copied", {
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.slice(-4)}`
  }

  const openInExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, "_blank")
    }
  }

  // Connected State
  if (address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="relative bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>

              {/* Address and Status */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-slate-900">
                    {formatAddress(address)}
                  </span>
                </div>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 p-2">
          <div className="px-3 py-2 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-slate-900">
                  Wallet Connected
                </div>
                <div className="text-sm text-slate-500 font-mono">
                  {formatAddress(address)}
                </div>
              </div>
            </div>
          </div>

          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="w-4 h-4 mr-3" />
            Copy Address
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openInExplorer} className="cursor-pointer">
            <ExternalLink className="w-4 h-4 mr-3" />
            View on Explorer
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDisconnect}
            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Disconnected State
  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

      <div className="relative flex items-center gap-3">
        {isConnecting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="font-medium">Connecting...</span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Connect Wallet</span>
            <Zap className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
          </>
        )}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    </Button>
  )
}

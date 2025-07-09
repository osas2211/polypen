"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, Zap, Wallet } from "lucide-react"
import { useCoinDetails } from "@/hooks/useZora"

interface TradingInterfaceProps {
  tokenSymbol: string
  balance: number
  currentPrice: number
}

export default function TradingInterface({
  tokenSymbol,
  balance,
  currentPrice,
}: TradingInterfaceProps) {
  // const {} = useCoinDetails()
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")

  const percentageButtons = [25, 50, 75, 100]

  const handlePercentageClick = (percentage: number) => {
    if (tradeType === "sell") {
      const sellAmount = (balance * percentage) / 100
      setAmount(sellAmount.toFixed(6))
    } else {
      // For buy, we'd calculate based on available ETH balance
      setAmount((percentage / 100).toFixed(6))
    }
  }

  const handleTrade = () => {
    // Handle trade logic here
    console.log(`${tradeType} ${amount} ${tokenSymbol}`)
  }

  const estimatedValue = Number.parseFloat(amount || "0") * currentPrice

  return (
    <Card className="bg-gradient-to-br from-white via-white to-slate-50 border-0 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
      <CardContent className="p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {tokenSymbol}
                  </h3>
                  <p className="text-slate-300 text-sm">Trade Token</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${currentPrice.toFixed(6)}
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-3 h-3" />
                  <span>+0.0%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-slate-300" />
                <span className="text-sm text-slate-300">Balance</span>
              </div>
              <Badge
                variant="outline"
                className="bg-white/10 border-white/20 text-white"
              >
                {balance.toFixed(6)} {tokenSymbol}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Trade Type Toggle */}
          <div className="relative bg-slate-100 rounded-2xl p-1.5">
            <div
              className={`absolute top-1.5 bottom-1.5 w-1/2 !bg-gradient-to-r rounded-xl transition-all duration-300 ease-out shadow-lg ${
                tradeType === "buy"
                  ? "left-1.5 !from-green-500 !to-emerald-600"
                  : "left-1/2 !from-pink-500 !to-rose-600"
              }`}
            />
            <div className="relative grid grid-cols-2">
              <Button
                variant="ghost"
                onClick={() => setTradeType("buy")}
                className={`relative z-10 h-12 font-semibold transition-colors duration-300 hover:bg-transparent ${
                  tradeType === "buy"
                    ? "text-white hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Buy
              </Button>
              <Button
                variant="ghost"
                onClick={() => setTradeType("sell")}
                className={`relative z-10 h-12 font-semibold transition-colors duration-300 hover:bg-transparent ${
                  tradeType === "sell"
                    ? "text-white hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sell
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-4 group-hover:border-slate-300 transition-colors duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Amount
                  </span>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>≈ ${estimatedValue.toFixed(4)}</span>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-3xl font-bold h-16 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-300"
                  />
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
                    <Coins className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">
                      {tokenSymbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Percentage Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {percentageButtons.map((percentage) => (
                <Button
                  key={percentage}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePercentageClick(percentage)}
                  className="h-10 bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 font-medium transition-all duration-200 hover:scale-105"
                >
                  {percentage}%
                </Button>
              ))}
            </div>
          </div>

          {/* Trade Button */}
          <div className="relative group">
            <div
              className={`absolute inset-0 rounded-2xl blur-xl opacity-75 transition-opacity duration-300 ${
                tradeType === "buy"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-pink-500 to-rose-600"
              }`}
            ></div>
            <Button
              onClick={handleTrade}
              disabled={!amount || Number.parseFloat(amount) <= 0}
              className={`relative w-full h-14 text-lg font-bold rounded-2xl border-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                tradeType === "buy"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25"
                  : "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg shadow-pink-500/25"
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {tradeType === "buy" ? "Buy Now" : "Sell Now"}
              </div>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">24h Volume</div>
              <div className="text-sm font-semibold text-slate-900">$4.66K</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Market Cap</div>
              <div className="text-sm font-semibold text-slate-900">
                $195.13K
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Coins,
  Activity,
} from "lucide-react"

interface TokenStatsProps {
  stats: {
    marketCap: number
    totalVolume: number
    creatorEarnings: number
    holders: number
    totalSupply: number
    priceChange24h: number
  }
}

export default function TokenStats({ stats }: TokenStatsProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`
    }
    return `$${amount.toFixed(2)}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const statCards = [
    {
      label: "Market Cap",
      value: formatCurrency(stats.marketCap),
      icon: DollarSign,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      label: "24h Volume",
      value: formatCurrency(stats.totalVolume),
      icon: Activity,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      label: "Creator Earnings",
      value: formatCurrency(stats.creatorEarnings),
      icon: Coins,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
    },
    // {
    //   label: "Holders",
    //   value: formatNumber(stats.holders),
    //   icon: Users,
    //   gradient: "from-emerald-500 to-teal-500",
    //   bgGradient: "from-emerald-50 to-teal-50",
    // },
    // {
    //   label: "24h Change",
    //   value: `${
    //     stats.priceChange24h >= 0 ? "+" : ""
    //   }${stats.priceChange24h.toFixed(2)}%`,
    //   icon: stats.priceChange24h >= 0 ? TrendingUp : TrendingDown,
    //   gradient:
    //     stats.priceChange24h >= 0
    //       ? "from-green-500 to-emerald-500"
    //       : "from-red-500 to-rose-500",
    //   bgGradient:
    //     stats.priceChange24h >= 0
    //       ? "from-green-50 to-emerald-50"
    //       : "from-red-50 to-rose-50",
    // },
  ]

  return (
    <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.label}
            className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-0"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
            ></div>
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
            <CardContent className="relative p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </div>
              <div
                className={`text-xl font-bold ${
                  stat.label === "24h Change"
                    ? stats.priceChange24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                    : "text-slate-900"
                }`}
              >
                {stat.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

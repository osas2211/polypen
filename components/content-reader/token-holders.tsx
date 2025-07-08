"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown, Verified } from "lucide-react"

interface Holder {
  id: string
  name: string
  avatar?: string
  percentage: number
  isCreator?: boolean
  isVerified?: boolean
  tokens: string
}

interface TokenHoldersProps {
  holders: Holder[]
  totalHolders: number
}

export default function TokenHolders({
  holders,
  totalHolders,
}: TokenHoldersProps) {
  const formatPercentage = (percentage: number) => {
    if (percentage >= 1) {
      return `${percentage.toFixed(2)}%`
    }
    return `${percentage.toFixed(3)}%`
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Holders
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {totalHolders}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {holders.map((holder, index) => (
          <div
            key={holder.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 w-4">
                {index + 1}
              </span>
              <Avatar className="w-8 h-8">
                <AvatarImage src={holder.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {holder.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">
                  {holder.name}
                </span>
                {holder.isCreator && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    creator
                  </Badge>
                )}
                {holder.isVerified && (
                  <Verified className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-900">
                {formatPercentage(holder.percentage)}
              </div>
              <div className="text-xs text-slate-500">
                {holder.tokens} tokens
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

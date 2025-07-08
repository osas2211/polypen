"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  type: "buy" | "sell"
  amount: string
  price: string
  timestamp: Date
}

interface TradingActivityProps {
  activities: Activity[]
}

export default function TradingActivity({ activities }: TradingActivityProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {activity.user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">
                    {activity.user.name}
                  </span>
                  <Badge
                    variant={
                      activity.type === "buy" ? "default" : "destructive"
                    }
                    className={`text-xs px-2 py-0.5 ${
                      activity.type === "buy"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {activity.type === "buy" ? "Buy" : "Sell"}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-900">
                {activity.amount}
              </div>
              <div className="text-xs text-slate-500">{activity.price}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Share2,
  Bookmark,
  MoreHorizontal,
  Clock,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"
import TokenStats from "@/components/content-reader/token-stats"
import TradingInterface from "@/components/content-reader/trading-interface"
import ContentTabs from "@/components/content-reader/content-tabs"
import RoleSelector from "@/components/content-reader/role-selector"
import EnhancedContent from "@/components/content-reader/enhanced-content"
import { useParams } from "next/navigation"
import ConnectButton from "@/components/connect-wallet"
import { useDocument, useDocuments } from "@/hooks/use-documents"

// Mock data
const mockContent = {
  id: "1",
  title: "Whispers of the Digital Dawn",
  content: `
    <div class="prose prose-lg max-w-none">
      <p class="lead text-xl text-slate-700 leading-relaxed mb-8">In the quiet hours before dawn, when the world sleeps and screens glow softly in darkened rooms, there exists a liminal space where technology and humanity converge.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">The Algorithm's Lullaby</h2>
      <div class="bg-gradient-to-r from-slate-50 to-purple-50 p-6 rounded-2xl border-l-4 border-purple-500 mb-6">
        <p class="italic text-slate-700 leading-relaxed">
          Lines of code cascade like digital rain,<br/>
          Each function a whispered prayer<br/>
          To the silicon gods we've made.<br/>
          In their binary dreams,<br/>
          Do they count electric sheep?
        </p>
      </div>
      
      <p class="text-slate-700 leading-relaxed mb-6">The modern poet sits before a glowing screen, fingers dancing across keys that have replaced the quill. Each keystroke is both creation and destruction—building worlds in the cloud while erasing the tactile memory of ink on paper.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Connection in Disconnection</h2>
      <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-l-4 border-blue-500 mb-6">
        <p class="italic text-slate-700 leading-relaxed">
          We are more connected than ever,<br/>
          Yet loneliness echoes through fiber optic cables.<br/>
          Our hearts beat in WiFi rhythms,<br/>
          Synchronized to notifications<br/>
          That never quite satisfy<br/>
          The ancient hunger for presence.
        </p>
      </div>
      
      <p class="text-slate-700 leading-relaxed mb-6">But perhaps this is not a lament. Perhaps this is evolution—the next chapter in humanity's story, written in JavaScript and dreams, compiled with hope and executed with wonder.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">The New Renaissance</h2>
      <p class="text-slate-700 leading-relaxed mb-6">In this digital dawn, we are all creators. The tools of gods rest in our pockets. We paint with pixels, sculpt with sound waves, and write poetry that travels at the speed of light to touch souls across continents.</p>
      
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border-l-4 border-emerald-500 mb-6">
        <p class="italic text-slate-700 leading-relaxed">
          The canvas is infinite,<br/>
          The palette unlimited,<br/>
          The audience global.<br/>
          We are the first generation<br/>
          To hold eternity<br/>
          In our hands.
        </p>
      </div>
      
      <p class="text-slate-700 leading-relaxed">So let us embrace this dawn, not with fear of what we're losing, but with wonder at what we're becoming. For in the marriage of human creativity and digital possibility, we find not the death of art, but its rebirth—more vibrant, more accessible, more alive than ever before.</p>
    </div>
  `,
  author: {
    name: "Maya Patel",
    username: "mayapoet",
    avatar: "https://avatar.vercel.sh/maya",
    verified: true,
  },
  category: "Poetry",
  publishedAt: "1 day ago",
  readTime: "5 min read",
  views: "3.2k",
  tokenSymbol: "WHISPER",
  createdAt: "Dec 15, 2024, 3:42 PM",
  contractAddress: "0xbd79f6b2c8e4a1b3c5d7e9f1a2b4c6d8e0f2a4b6",
  chain: "Base",
  mediaType: "Poetry",
  wordCount: 342,
}

const mockStats = {
  marketCap: 195130,
  totalVolume: 4660,
  creatorEarnings: 0,
  holders: 1247,
  totalSupply: 1000000,
  priceChange24h: 12.5,
}

const mockHolders = [
  {
    id: "1",
    name: "Market",
    percentage: 97.826,
    tokens: "978,260",
  },
  {
    id: "2",
    name: "mayapoet",
    avatar: "https://avatar.vercel.sh/maya",
    percentage: 1.0,
    tokens: "10,000",
    isCreator: true,
  },
  {
    id: "3",
    name: "jessepollak",
    avatar: "https://avatar.vercel.sh/jesse",
    percentage: 0.931,
    tokens: "9,310",
    isVerified: true,
  },
  {
    id: "4",
    name: "zoxo_zor",
    avatar: "https://avatar.vercel.sh/zoxo",
    percentage: 0.135,
    tokens: "1,350",
  },
  {
    id: "5",
    name: "churchzero2001",
    avatar: "https://avatar.vercel.sh/church",
    percentage: 0.108,
    tokens: "1,080",
  },
]

const mockActivities = [
  {
    id: "1",
    user: { name: "numata", avatar: "https://avatar.vercel.sh/numata" },
    type: "sell" as const,
    amount: "1.7m",
    price: "$0.34",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    user: { name: "numata", avatar: "https://avatar.vercel.sh/numata" },
    type: "buy" as const,
    amount: "1.7m",
    price: "$0.36",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    user: { name: "zoxo_zor", avatar: "https://avatar.vercel.sh/zoxo" },
    type: "buy" as const,
    amount: "1.4m",
    price: "$0.27",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
]

export default function ContentReaderPage() {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [selectedRole, setSelectedRole] = useState("default")
  const { id } = useParams()
  const { data, isLoading } = useDocument(id as string)
  if (isLoading) {
    return <></>
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`${
                  isBookmarked
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                    : "bg-white/50 hover:bg-white"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 mr-2 ${
                    isBookmarked ? "fill-current" : ""
                  }`}
                />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
              <ConnectButton />
              <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Content Header */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 ring-4 ring-white shadow-lg">
                  <AvatarImage src={"https://avatar.vercel.sh/maya"} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                    {mockContent.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-lg">
                      Maya Patel
                    </span>
                    <span className="text-slate-500"></span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{mockContent.publishedAt}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{mockContent.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{mockContent.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-3 py-1"
                  >
                    {mockContent.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 px-3 py-1"
                  >
                    ${mockContent.tokenSymbol}
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  {data?.title}
                </h1>
              </div>
            </div>

            {/* Token Stats */}
            <TokenStats stats={mockStats} />

            {/* Role Selector */}
            <RoleSelector
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />

            {/* Enhanced Content */}
            <EnhancedContent content={data?.content!} role={selectedRole} />
          </div>

          {/* Sidebar - Static Components */}
          <div className="space-y-6">
            {/* Trading Interface - Now static */}
            <TradingInterface
              tokenSymbol={data?.tokenSymbol!}
              balance={0}
              currentPrice={0.000111}
            />

            {/* Content Tabs - Static */}
            <ContentTabs
              contentDetails={{
                ...mockContent,
                creator: mockContent.author.username,
              }}
              holders={mockHolders}
              activities={mockActivities}
              totalHolders={mockStats.holders}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

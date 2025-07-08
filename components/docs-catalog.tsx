"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Clock,
  BookOpen,
  Sparkles,
  TrendingUp,
  Filter,
  Heart,
  Music,
  Feather,
} from "lucide-react"
import Link from "next/link"

interface Doc {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  views: string
  publishedAt: string
  author: {
    name: string
    avatar: string
  }
  featured: boolean
  gradient: string
  tags: string[]
}

const mockDocs: Doc[] = [
  {
    id: "1",
    title: "Whispers of the Digital Dawn",
    excerpt:
      "A collection of verses exploring the intersection of technology and human emotion, where code meets poetry in the modern age.",
    category: "Poetry",
    readTime: "5 min read",
    views: "3.2k",
    publishedAt: "1 day ago",
    author: {
      name: "Maya Patel",
      avatar: "https://avatar.vercel.sh/maya",
    },
    featured: true,
    gradient: "from-rose-600 via-pink-600 to-purple-600",
    tags: ["Digital Poetry", "Technology", "Modern Verse"],
  },
  {
    id: "2",
    title: "The Art of Storytelling in Product Design",
    excerpt:
      "How narrative techniques from literature can transform user experiences and create more engaging digital products.",
    category: "Design",
    readTime: "8 min read",
    views: "2.4k",
    publishedAt: "2 days ago",
    author: {
      name: "Sarah Chen",
      avatar: "https://avatar.vercel.sh/sarah",
    },
    featured: true,
    gradient: "from-purple-600 via-pink-600 to-blue-600",
    tags: ["Storytelling", "UX Design", "Narrative"],
  },
  {
    id: "3",
    title: "Melodies in Minor: A Composer's Journey",
    excerpt:
      "An intimate exploration of creating music that captures melancholy and hope, with insights into the creative process.",
    category: "Music",
    readTime: "12 min read",
    views: "1.8k",
    publishedAt: "3 days ago",
    author: {
      name: "James Rivera",
      avatar: "https://avatar.vercel.sh/james",
    },
    featured: false,
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    tags: ["Composition", "Music Theory", "Creative Process"],
  },
  {
    id: "4",
    title: "Building Scalable React Applications",
    excerpt:
      "A comprehensive guide to architecting React applications that can grow with your team and user base.",
    category: "Development",
    readTime: "15 min read",
    views: "4.1k",
    publishedAt: "5 days ago",
    author: {
      name: "Alex Rodriguez",
      avatar: "https://avatar.vercel.sh/alex",
    },
    featured: false,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    tags: ["React", "Architecture", "Scalability"],
  },
  {
    id: "5",
    title: "The Writer's Toolkit: Crafting Compelling Characters",
    excerpt:
      "Essential techniques for developing three-dimensional characters that readers will remember long after the final page.",
    category: "Writing",
    readTime: "10 min read",
    views: "2.9k",
    publishedAt: "1 week ago",
    author: {
      name: "Elena Vasquez",
      avatar: "https://avatar.vercel.sh/elena",
    },
    featured: false,
    gradient: "from-amber-600 via-orange-600 to-red-600",
    tags: ["Character Development", "Fiction Writing", "Storytelling"],
  },
  {
    id: "6",
    title: "Haiku for the Hurried Soul",
    excerpt:
      "Finding moments of zen and clarity through the ancient art of haiku, perfect for our fast-paced digital world.",
    category: "Poetry",
    readTime: "4 min read",
    views: "5.3k",
    publishedAt: "1 week ago",
    author: {
      name: "Kenji Nakamura",
      avatar: "https://avatar.vercel.sh/kenji",
    },
    featured: false,
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    tags: ["Haiku", "Mindfulness", "Japanese Poetry"],
  },
  {
    id: "7",
    title: "The API of Emotions: Technical Writing with Heart",
    excerpt:
      "How to infuse personality and empathy into technical documentation, making complex concepts accessible and engaging.",
    category: "Writing",
    readTime: "7 min read",
    views: "3.7k",
    publishedAt: "2 weeks ago",
    author: {
      name: "Marcus Johnson",
      avatar: "https://avatar.vercel.sh/marcus",
    },
    featured: false,
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    tags: ["Technical Writing", "Documentation", "Communication"],
  },
  {
    id: "8",
    title: "Rhythm and Code: Programming to a Beat",
    excerpt:
      "Exploring the surprising parallels between musical composition and software development, and how rhythm can improve your coding.",
    category: "Music",
    readTime: "9 min read",
    views: "2.1k",
    publishedAt: "2 weeks ago",
    author: {
      name: "Luna Martinez",
      avatar: "https://avatar.vercel.sh/luna",
    },
    featured: false,
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    tags: ["Music", "Programming", "Creativity"],
  },
  {
    id: "9",
    title: "Blogging Beyond the Basics",
    excerpt:
      "Advanced strategies for creating blog content that resonates, builds community, and stands out in a crowded digital landscape.",
    category: "Blogging",
    readTime: "11 min read",
    views: "4.5k",
    publishedAt: "3 weeks ago",
    author: {
      name: "David Kim",
      avatar: "https://avatar.vercel.sh/david",
    },
    featured: false,
    gradient: "from-slate-600 via-gray-600 to-zinc-600",
    tags: ["Content Strategy", "Blogging", "Audience Building"],
  },
  {
    id: "10",
    title: "Product Management Through a Poet's Lens",
    excerpt:
      "How the sensitivity and observation skills of poetry can enhance product strategy and user understanding.",
    category: "Product",
    readTime: "8 min read",
    views: "1.6k",
    publishedAt: "1 month ago",
    author: {
      name: "Aria Thompson",
      avatar: "https://avatar.vercel.sh/aria",
    },
    featured: false,
    gradient: "from-pink-600 via-rose-600 to-red-600",
    tags: ["Product Management", "Creative Thinking", "Strategy"],
  },
]

const categories = [
  "All",
  "Poetry",
  "Writing",
  "Music",
  "Design",
  "Development",
  "Blogging",
  "Product",
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Poetry":
      return <Feather className="w-4 h-4" />
    case "Writing":
      return <BookOpen className="w-4 h-4" />
    case "Music":
      return <Music className="w-4 h-4" />
    case "Design":
      return <Sparkles className="w-4 h-4" />
    case "Development":
      return <Search className="w-4 h-4" />
    case "Blogging":
      return <Heart className="w-4 h-4" />
    case "Product":
      return <TrendingUp className="w-4 h-4" />
    default:
      return <BookOpen className="w-4 h-4" />
  }
}

export default function DocsCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const filteredDocs = mockDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredDocs = filteredDocs.filter((doc) => doc.featured)
  const regularDocs = filteredDocs.filter((doc) => !doc.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(#9C92AC_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Where Creativity Meets Knowledge</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Creative
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              A curated collection of insights, stories, and guides from poets,
              writers, musicians, developers, and creators of all kinds.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search stories, poems, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                      : "bg-white/80 backdrop-blur-sm hover:bg-white"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {category !== "All" && getCategoryIcon(category)}
                    {category}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {featuredDocs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Featured Stories
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredDocs.map((doc) => (
                <Link href={`/content/${doc.id}`} key={doc.id}>
                  <Card
                    className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    onMouseEnter={() => setHoveredCard(doc.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${doc.gradient} opacity-90`}
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    <CardContent className="relative p-8 text-white h-80 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-white border-0 flex items-center gap-1"
                          >
                            {getCategoryIcon(doc.category)}
                            {doc.category}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-white/10 text-white border-0"
                          >
                            Featured
                          </Badge>
                        </div>

                        <h3 className="text-2xl font-bold leading-tight group-hover:text-white/90 transition-colors">
                          {doc.title}
                        </h3>

                        <p className="text-white/80 leading-relaxed">
                          {doc.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-white/20">
                            <AvatarImage
                              src={doc.author.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {doc.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {doc.author.name}
                            </p>
                            <p className="text-white/60 text-xs">
                              {doc.publishedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-white/70">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{doc.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{doc.views}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300 ${
                        hoveredCard === doc.id ? "opacity-60" : "opacity-0"
                      }`}
                    />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        {regularDocs.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-slate-600" />
              <h2 className="text-3xl font-bold text-slate-900">All Content</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {regularDocs.map((doc) => (
                <Link href={`/content/${doc.id}`} key={doc.id}>
                  <Card
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredCard(doc.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${doc.gradient}`}
                    />

                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="bg-white/50 flex items-center gap-1"
                        >
                          {getCategoryIcon(doc.category)}
                          {doc.category}
                        </Badge>
                        <div className="flex gap-1">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-slate-100 text-slate-600"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-purple-700 transition-colors">
                        {doc.title}
                      </h3>

                      <p className="text-slate-600 leading-relaxed text-sm">
                        {doc.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={doc.author.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="text-xs">
                              {doc.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-slate-900">
                              {doc.author.name}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {doc.publishedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{doc.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{doc.views}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${doc.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDocs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No content found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search or explore different categories
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
            >
              Explore All Content
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

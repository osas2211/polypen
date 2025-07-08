"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Code,
  Palette,
  BookOpen,
  Music,
  Briefcase,
  Lightbulb,
  Target,
} from "lucide-react"

interface RoleBasedReaderProps {
  content: string
  role: string
}

export default function RoleBasedReader({
  content,
  role,
}: RoleBasedReaderProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case "engineer":
        return {
          icon: Code,
          color: "blue",
          gradient: "from-blue-500 to-cyan-500",
          bgGradient: "from-blue-50 to-cyan-50",
          perspective: "Technical Implementation",
          highlights: [
            "algorithm",
            "code",
            "function",
            "binary",
            "digital",
            "silicon",
            "JavaScript",
            "compiled",
            "executed",
            "fiber optic",
            "WiFi",
            "pixels",
            "sound waves",
          ],
          annotations: {
            "Lines of code cascade like digital rain":
              "This metaphor beautifully captures the visual nature of code execution and data flow in modern systems.",
            "Each function a whispered prayer":
              "Functions as modular, reusable components - the building blocks of scalable software architecture.",
            "written in JavaScript and dreams":
              "JavaScript's versatility in both frontend and backend development makes it a perfect metaphor for universal creation.",
            "We paint with pixels, sculpt with sound waves":
              "Digital signal processing and computer graphics - the technical artistry of modern development.",
          },
        }
      case "designer":
        return {
          icon: Palette,
          color: "purple",
          gradient: "from-purple-500 to-pink-500",
          bgGradient: "from-purple-50 to-pink-50",
          perspective: "Design & User Experience",
          highlights: [
            "screens glow",
            "visual",
            "paint",
            "pixels",
            "canvas",
            "palette",
            "colors",
            "interface",
            "experience",
            "aesthetic",
            "beauty",
            "art",
          ],
          annotations: {
            "screens glow softly in darkened rooms":
              "The importance of ambient lighting and screen brightness in creating comfortable user experiences.",
            "We paint with pixels":
              "Digital design as a medium - every pixel is intentional, every color choice meaningful.",
            "The canvas is infinite":
              "Digital design breaks traditional constraints - infinite artboards, unlimited iterations, global reach.",
            "more vibrant, more accessible":
              "Accessibility and inclusive design principles that make art available to everyone.",
          },
        }
      case "poet":
        return {
          icon: BookOpen,
          color: "emerald",
          gradient: "from-emerald-500 to-teal-500",
          bgGradient: "from-emerald-50 to-teal-50",
          perspective: "Literary & Artistic Expression",
          highlights: [
            "whispered",
            "prayer",
            "dreams",
            "poetry",
            "verse",
            "rhythm",
            "metaphor",
            "lullaby",
            "echo",
            "hunger",
            "soul",
            "eternity",
          ],
          annotations: {
            "Lines of code cascade like digital rain":
              "A beautiful metaphor connecting the technical with the natural - code as precipitation of thought.",
            "Each function a whispered prayer":
              "The sacred act of creation through language, whether in verse or code.",
            "loneliness echoes through fiber optic cables":
              "The paradox of connection - how technology can both unite and isolate us.",
            "We are the first generation to hold eternity in our hands":
              "The profound responsibility and opportunity of digital permanence.",
          },
        }
      case "musician":
        return {
          icon: Music,
          color: "amber",
          gradient: "from-amber-500 to-orange-500",
          bgGradient: "from-amber-50 to-orange-50",
          perspective: "Rhythm & Harmony",
          highlights: [
            "rhythm",
            "beat",
            "synchronized",
            "sound waves",
            "harmony",
            "melody",
            "composition",
            "tempo",
            "frequency",
            "resonance",
            "acoustic",
          ],
          annotations: {
            "Our hearts beat in WiFi rhythms":
              "The synchronization of human biological rhythms with digital frequencies - a new form of musical time.",
            "sculpt with sound waves":
              "Digital audio processing as sculpture - shaping frequencies and harmonics in virtual space.",
            "Synchronized to notifications":
              "The percussion of modern life - each ping and buzz creating the rhythm of our daily existence.",
            "travels at the speed of light":
              "The instantaneous nature of digital music distribution - from creation to global audience in milliseconds.",
          },
        }
      case "product-manager":
        return {
          icon: Briefcase,
          color: "indigo",
          gradient: "from-indigo-500 to-purple-500",
          bgGradient: "from-indigo-50 to-purple-50",
          perspective: "Strategy & User Impact",
          highlights: [
            "user",
            "experience",
            "global",
            "audience",
            "accessible",
            "tools",
            "platform",
            "scale",
            "impact",
            "adoption",
            "market",
          ],
          annotations: {
            "The tools of gods rest in our pockets":
              "The democratization of powerful technology - smartphones as the ultimate product platform.",
            "more accessible, more alive than ever before":
              "Product accessibility and user adoption - removing barriers to creative expression.",
            "The audience global":
              "Global market reach and the network effects of digital platforms.",
            "We are more connected than ever":
              "Understanding user behavior and the social dynamics of digital products.",
          },
        }
      case "entrepreneur":
        return {
          icon: Lightbulb,
          color: "rose",
          gradient: "from-rose-500 to-pink-500",
          bgGradient: "from-rose-50 to-pink-50",
          perspective: "Innovation & Opportunity",
          highlights: [
            "opportunity",
            "creation",
            "innovation",
            "evolution",
            "transformation",
            "revolution",
            "disruption",
            "market",
            "value",
            "growth",
          ],
          annotations: {
            "Perhaps this is evolution":
              "Recognizing paradigm shifts and technological evolution as business opportunities.",
            "we are all creators":
              "The creator economy and the democratization of content creation and monetization.",
            "The tools of gods rest in our pockets":
              "The massive market opportunity in mobile-first solutions and accessible technology.",
            "more vibrant, more accessible, more alive":
              "The business case for inclusive design and global market expansion.",
          },
        }
      default:
        return {
          icon: Code,
          color: "blue",
          gradient: "from-blue-500 to-cyan-500",
          bgGradient: "from-blue-50 to-cyan-50",
          perspective: "General",
          highlights: [],
          annotations: {},
        }
    }
  }

  const roleConfig = getRoleConfig(role)
  const Icon = roleConfig.icon

  const highlightContent = (
    content: string,
    highlights: string[],
    annotations: Record<string, string>
  ) => {
    let highlightedContent = content

    // Apply highlights
    highlights.forEach((term) => {
      const regex = new RegExp(`\\b(${term})\\b`, "gi")
      highlightedContent = highlightedContent.replace(
        regex,
        `<mark class="bg-${roleConfig.color}-100 text-${roleConfig.color}-800 px-1 py-0.5 rounded font-medium">$1</mark>`
      )
    })

    // Add annotations
    Object.entries(annotations).forEach(([phrase, annotation]) => {
      const regex = new RegExp(
        `(${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      )
      highlightedContent = highlightedContent.replace(
        regex,
        `<span class="relative group cursor-help">
          <span class="border-b-2 border-dashed border-${roleConfig.color}-400">$1</span>
          <div class="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-80 p-3 bg-white border border-slate-200 rounded-lg shadow-xl">
            <div class="text-xs font-medium text-${roleConfig.color}-600 mb-1">${roleConfig.perspective} Insight:</div>
            <div class="text-sm text-slate-700">${annotation}</div>
          </div>
        </span>`
      )
    })

    return highlightedContent
  }

  const processedContent = highlightContent(
    content,
    roleConfig.highlights,
    roleConfig.annotations as any
  )

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <Card
        className={`bg-gradient-to-r ${roleConfig.bgGradient} border-0 shadow-lg`}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${roleConfig.gradient} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Reading as a{" "}
                {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
              </h3>
              <p className="text-slate-600">
                Perspective: {roleConfig.perspective}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-2 bg-${roleConfig.color}-100 rounded`}
              ></div>
              <span className="text-slate-600">Key terms highlighted</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-0.5 border-b-2 border-dashed border-${roleConfig.color}-400`}
              ></div>
              <span className="text-slate-600">Hover for insights</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Content */}
      <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl">
        <CardContent className="p-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </CardContent>
      </Card>

      {/* Role-Specific Insights */}
      <Card
        className={`bg-gradient-to-br ${roleConfig.bgGradient} border-0 shadow-lg`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${roleConfig.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
            >
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-2">
                Key Takeaways for{" "}
                {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
                s
              </h4>
              <div className="space-y-2 text-sm text-slate-700">
                {role === "engineer" && (
                  <>
                    <p>
                      • Consider the technical metaphors as inspiration for
                      system architecture
                    </p>
                    <p>
                      • The intersection of creativity and logic in software
                      development
                    </p>
                    <p>• How code becomes a medium for artistic expression</p>
                  </>
                )}
                {role === "designer" && (
                  <>
                    <p>• Digital design as a new form of artistic medium</p>
                    <p>• The importance of accessibility in creative tools</p>
                    <p>• How technology expands the designer's palette</p>
                  </>
                )}
                {role === "poet" && (
                  <>
                    <p>• Technology as a new source of metaphor and imagery</p>
                    <p>• The evolution of language in the digital age</p>
                    <p>• Finding humanity within technological advancement</p>
                  </>
                )}
                {role === "musician" && (
                  <>
                    <p>
                      • Digital rhythms and the new soundscape of modern life
                    </p>
                    <p>• Technology as both instrument and medium</p>
                    <p>• The global reach of digital music distribution</p>
                  </>
                )}
                {role === "product-manager" && (
                  <>
                    <p>• User behavior in the age of constant connectivity</p>
                    <p>• The democratization of creative tools and platforms</p>
                    <p>• Building products that enhance human creativity</p>
                  </>
                )}
                {role === "entrepreneur" && (
                  <>
                    <p>• The creator economy as a massive market opportunity</p>
                    <p>
                      • Democratization of tools creates new business models
                    </p>
                    <p>
                      • Technology evolution drives innovation opportunities
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
